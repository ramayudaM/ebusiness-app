.PHONY: up down build shell artisan npm migrate seed logs

up:
	podman compose up -d

down:
	podman compose down

build:
	podman compose build

shell:
	podman exec -it nadakita-app bash

artisan:
	podman exec -it nadakita-app php artisan $(filter-out $@,$(MAKECMDGOALS))

npm:
	podman exec -it nadakita-app npm $(filter-out $@,$(MAKECMDGOALS))

migrate:
	podman exec -it nadakita-app php artisan migrate

seed:
	podman exec -it nadakita-app php artisan db:seed

logs:
	podman compose logs -f
