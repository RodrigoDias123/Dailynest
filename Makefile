COMPOSE = docker compose --env-file .env

build:
	$(COMPOSE) build

start: build
	$(COMPOSE) up -d
	@until curl -sf htpp://localhost:8080 > /dev/null 2>&1; do sleep 1; done

stop:
	$(COMPOSE) down

clean: stop
	docker system prune -fa