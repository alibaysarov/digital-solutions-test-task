docker compose -f docker-compose.yml build --no-cache

docker compose run --rm backend sh

docker compose -f docker-compose.yml up -d