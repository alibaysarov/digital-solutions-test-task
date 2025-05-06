import { Router } from 'express';
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

router.get('/', (req, res) => userController.getAll(req,res));

router.post('/',validateDto(SearchUserDto), (req, res) => userController.searchUsers(req, res));
router.post('/mark',validateDto(SearchUserDto), (req, res) => userController.markUsers(req, res));

router.get('/sorts', (req, res) => userController.getSortsAndMarked(req,res));

router.post("/redis",(req,res)=>{
     const sortData = req.body.sort;

     redisClient.set("sort", JSON.stringify(sortData));

     redisClient.get("sort", (err, data) => {
          if (err) return res.status(500).send(err);

          res.json({
               received: JSON.parse(data || '{}')
          });
     });
})
export default router;