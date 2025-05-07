import db from "../prisma"
import esClient from "../esClient";
import {User, UserDto} from "../../models/User";
// Конфигурация
const BATCH_SIZE = 1000;
const INDEX_NAME = 'users';

async function createIndexIfNotExists() {
    const exists = await esClient.indices.exists({ index: INDEX_NAME });
    if (!exists) {
        await esClient.indices.create({
            index: INDEX_NAME,
            mappings :{
                properties: {
                    fullName: { type: 'text' },
                    email: { type: 'keyword' },
                    createdAt: { type: 'date' },
                    updatedAt: { type: 'date' },
                    deletedAt: { type: 'date' }
                },
            },
        });
        console.log(`✅ Индекс "${INDEX_NAME}" создан`);
    } else {
        console.log(`ℹ️ Индекс "${INDEX_NAME}" уже существует`);
    }
}

async function importUsersToElasticsearch() {
    console.log('🚀 Начинаем импорт пользователей в Elasticsearch...');

    let skip = 0;

    while (true) {
        const users:User[] = await db.user.findMany({
            skip,
            take: BATCH_SIZE,
        });

        if (users.length === 0) break;

        const bulkBody = users.flatMap(user => [
            { index: { _index: INDEX_NAME, _id: user.id.toString() } },
            {
                fullName: user.fullName,
                email: user.email,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
                deletedAt: user.deletedAt ? user.deletedAt.toISOString() : null,
            },
        ]);

        await esClient.bulk({ body: bulkBody });
        console.log(`📤 Импортировано ${skip + users.length} записей`);

        skip += BATCH_SIZE;
    }

    console.log('✅ Все пользователи успешно импортированы в Elasticsearch');
}

async function main() {
    try {
        await createIndexIfNotExists();
        await importUsersToElasticsearch();
    } catch (error) {
        console.error('❌ Ошибка при импорте:', error);
    } finally {
        await db.$disconnect();
    }
}

main();