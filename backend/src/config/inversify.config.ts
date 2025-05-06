import 'reflect-metadata';
import { Container } from 'inversify';
import UserServiceImpl  from '../services/UserService';
import { UserController } from '../controllers/userController';

import { TYPES } from '../types';

const container = new Container();

container.bind<UserServiceImpl>(TYPES.UserService).to(UserServiceImpl);
container.bind<UserController>(TYPES.UserController).to(UserController);
export { container };