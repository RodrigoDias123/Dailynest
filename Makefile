build:
	docker compose build

start: build
	docker compose up -d

stop:
	docker compose down

clean: stop
	docker system prune -fa