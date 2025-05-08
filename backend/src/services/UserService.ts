import {UserDto} from "../models/User";
import db from "../orm/prisma";
import esClient from "../orm/esClient";
import {SortAndMarked, UserResource, UserService} from "../types";
import {SearchUserDto} from "../dtos/SearchUser";
import {injectable} from "inversify";
import redisClient from "../utils/redis";


@injectable()
export default class UserServiceImpl implements UserService {
    async markUsers(ids: number[]): Promise<Record<string, string>> {
        redisClient.set("marked", JSON.stringify(ids));
        return {"message": "mark on users added!"}
    }

    async cacheUsersOrder(users: UserDto[]): Promise<Record<string, string>> {
        redisClient.set("users:order", JSON.stringify(users));
        return {"message": "Order of users changed!"}
    }

    async getSortsAndMarked(): Promise<SortAndMarked> {
        try {
            return {
                sort: await this.getSort(),
                marked: await this.getMarked(),
                users: await this.getOrderedUsers()
            };
        } catch (error) {
            console.error('Ошибка при поиске фильтров:', error);
            return {sort: {}, marked: [], users: []};
        }
    }


    async searchUsers(dto: SearchUserDto): Promise<UserResource> {
        const {query, page, sort} = dto
        const size = 20;
        const from = (page - 1) * size;
        try {
            const cachedUsers: UserDto[] = await this.getOrderedUsers();
            const lastSort = await this.getSort()
            const changed = JSON.stringify(sort) !== JSON.stringify(lastSort);
            if (query == '' && page == 1 && !changed) {
                if (cachedUsers != null && cachedUsers.length > 0) {
                    console.log("taking from cache");
                    return {
                        results: cachedUsers,
                        total: cachedUsers.length,
                    }
                }
            }
            const sortOptions = await this.processSort(sort, changed);
            let searchQuery;
            if (cachedUsers.length > 0) {
                const excludedIds: number[] = cachedUsers.map(el => el.id);
                searchQuery = query
                    ? {
                        bool: {
                            must: {
                                match: {
                                    fullName: {
                                        query,
                                        fuzziness: 'AUTO',
                                    },
                                },
                            },
                            must_not: excludedIds.length > 0
                                ? {
                                    terms: {
                                        _id: excludedIds,
                                    },
                                }
                                : undefined,
                        },
                    }
                    : {
                        bool: {
                            must: {
                                match_all: {},
                            },
                            must_not: excludedIds.length > 0
                                ? {
                                    terms: {
                                        _id: excludedIds,
                                    },
                                }
                                : undefined,
                        },
                    };
            } else {
                searchQuery = query
                    ? {
                        match: {
                            fullName: {
                                query,
                                fuzziness: 'AUTO',
                            },
                        }
                    }
                    : {match_all: {}};
            }


            console.log("sort options ", sortOptions);
            const result = await esClient.search({
                index: 'users',
                from,
                size,
                query: searchQuery,
                sort: sortOptions.length > 0 ? sortOptions : undefined,
            });
            const hits = result.hits.hits as Array<{
                _id: string;
                _source: {
                    fullName: string;
                    email: string;
                };
            }>;

            const users = hits.map(hit => ({
                id: parseInt(hit._id),
                fullName: hit._source.fullName,
                email: hit._source.email,
            }));
            redisClient.set("users:order", JSON.stringify(users));
            return {
                results: users,
                total: result.hits.hits.length ?? 0,
            };
        } catch (error) {
            console.error('Ошибка при поиске пользователей:', error);
            return {results: [], total: 0};
        }
    }

    async getAll(): Promise<UserDto[]> {
        try {
            return await db.user.findMany({
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                },
                take: 20
            })
        } catch (error) {
            console.error('Ошибка при получении записей:', error)
            return []
        } finally {
            await db.$disconnect()
        }
    }

    private async getSort() {
        const sort = await redisClient.get("sort");
        return sort ? JSON.parse(sort) : {};
    }

    private async getMarked() {
        const marked = await redisClient.get("marked");
        return marked ? JSON.parse(marked) : [];
    }

    private async getOrderedUsers() {
        const users = await redisClient.get("users:order");
        return users ? JSON.parse(users) : [];
    }

    private async processSort(
        dtoSort: Record<string, string>,
        changed: boolean
    ): Promise<Array<Record<string, { order: 'asc' | 'desc' }>>> {

        const lastSort = await this.getSort();

        if (changed) {
            await redisClient.del("marked");
        }

        redisClient.set("sort", JSON.stringify(dtoSort));

        return Object.entries(dtoSort).map(([sortKey, sortVal]) => ({
            [`${sortKey}.keyword`]: {
                order: sortVal as 'asc' | 'desc',
            },
        }));
    }


}