import {UserDto} from "../models/User";
import {SearchUserDto} from "../dtos/SearchUser";

export interface SortAndMarked{
    sort:Record<string, string>,
    marked:number[]
}
export interface UserService {
    getAll: () => Promise<UserDto[]>,
    searchUsers(dto:SearchUserDto): Promise<{ results: UserDto[]; total: number }>;
    getSortsAndMarked(): Promise<SortAndMarked>
    markUsers(ids:number[]):Promise<Record<string, string>>
}

export interface UserResource {
    results: UserDto[];
    total: number
}

const TYPES = {
    UserService: Symbol.for('UserService'),
    UserController: Symbol.for('UserController'),
};

export { TYPES };