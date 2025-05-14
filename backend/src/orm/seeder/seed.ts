import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// Конфигурация
const TOTAL_RECORDS = 1_000_000;
const BATCH_SIZE = 1000;

async function main() {
    const count = await prisma.user.count()
    if(!count) {
        console.log(`Starting to seed ${TOTAL_RECORDS} users...`);

        for (let i = 0; i < TOTAL_RECORDS; i += BATCH_SIZE) {
            const users = Array.from({ length: Math.min(BATCH_SIZE, TOTAL_RECORDS - i) })
                .map((_, index) => ({
                    fullName: `${i + index + 1}`,
                    email: `${faker.string.uuid()}@${faker.internet.domainName()}`, // Уникальный email
                    password: faker.internet.password(),
                    createdAt: faker.date.past(),
                    updatedAt: faker.date.recent(),
                    deletedAt: Math.random() > 0.9 ? faker.date.past() : null, // 10% "удаленных" пользователей
                }));

            await prisma.user.createMany({
                data: users,
                skipDuplicates: true, // Пропускать дубликаты по unique полям
            });

            console.log(`Seeded ${i + users.length} users`);
        }
    } else {
        console.log(`DB is not empty it has ${count} elements!`);
    }

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });