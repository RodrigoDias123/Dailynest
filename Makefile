.env:
	cp .env.example .env

build:.env
	mkdir -p ./volumes/pgadmin
	sudo chown -R 5050:5050 ./volumes/pgadmin
	docker compose build

start: build
	docker compose up -d

stop:
	docker compose down

clean: stop
	sudo rm -rf ./volumes
	docker system prune -fa