import { Router,Request,Response } from 'express';
import {
     UserController,
} from '../controllers/userController';
import {SearchUserDto} from "../dtos/SearchUser";
import {validateDto} from "../middlewares/validationMiddleware";
import {container} from "../config/inversify.config";
import {TYPES} from "../types";
import redisClient from "../utils/redis";

const router = Router();
const userController = container.get<UserController>(TYPES.UserController);

router.get('/', (req:Request, res:Response) => userController.getAll(req,res));

router.post('/',validateDto(SearchUserDto), (req:Request, res:Response) => userController.searchUsers(req, res));
router.post('/mark',validateDto(SearchUserDto), (req:Request, res:Response) => userController.markUsers(req, res));
router.get('/sorts', (req:Request, res:Response) => userController.getSortsAndMarked(req,res));

export default router;