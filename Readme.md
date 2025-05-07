### Запуск в DOCKER

<pre>
docker compose -f docker-compose.local.yml up -d
</pre>

### Миграции

<pre>
npx prisma migrate dev --name init
</pre> 

### Сидеры

<pre>
docker exec -it backend sh
npm run seed
</pre>

### Создание индекса в Elastic search и наполнение данными

<pre>
docker exec -it backend sh
npm run index:bulk
</pre>