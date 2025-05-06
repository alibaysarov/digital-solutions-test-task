import { PrismaClient } from "@prisma/client";
import {createSoftDeleteMiddleware} from "prisma-soft-delete-middleware";

const client = new PrismaClient();

client.$use(
    createSoftDeleteMiddleware({
        models: {
            User: {
                field: "deletedAt",
                createValue: (deleted) => {
                    if (deleted) return new Date();
                    return null;
                },
            }

        },
    })
);