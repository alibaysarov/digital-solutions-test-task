import {Request, Response, NextFunction} from 'express';
import {UserDto} from "../models/User";
import {SearchUserDto} from "../dtos/SearchUser";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import UserServiceImpl from "../services/UserService";
@injectable()
export class UserController {
    constructor(@inject(TYPES.UserService) private readonly userService: UserServiceImpl) {}

    async getAll(req: Request, res: Response) {
        try {
            const users: UserDto[] = await this.userService.getAll();
            res.json(users);
        } catch (error) {
            console.log(error)
            res.status(500).json({error: 'Не удалось получить пользователей'});
        }
    }
    async searchUsers(req: Request, res: Response) {
        try {
            const body:SearchUserDto = req.body as SearchUserDto;
            const data = await this.userService.searchUsers(body);
            res.json(data);
        } catch (error) {
            console.log(error)
            res.status(500).json({error: 'Не удалось получить пользователей'});
        }
    }
    async getSortsAndMarked(req: Request, res: Response) {
        try {
            const data = await this.userService.getSortsAndMarked();
            res.json(data);
        } catch (error) {
            console.log(error)
            res.status(500).json({error: 'Не удалось получить фильтры'});
        }
    }
    async markUsers(req: Request, res: Response) {
        try {
            const data = await this.userService.markUsers(req.body.users);
            res.json(data);
        } catch (error) {
            console.log(error)
            res.status(500).json({error: 'Не удалось отметить пользователей'});
        }
    }
}