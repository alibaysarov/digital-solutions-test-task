import {plainToInstance} from 'class-transformer';
import {validate} from 'class-validator';
import {NextFunction, Request, Response} from 'express';

export const validateDto = (dtoClass: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dtoObject = plainToInstance(dtoClass, req.body);
        const errors = await validate(dtoObject);

        if (errors.length > 0) {
            res.status(422).json({
                message: 'Validation failed',
                errors,
            });
            return;
        }

        req.body = dtoObject;
        next();
    };
};