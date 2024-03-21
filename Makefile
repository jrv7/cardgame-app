#!make
# —— Inspired by ———————————————————————————————————————————————————————————————
# Maverick
# Setup ————————————————————————————————————————————————————————————————————————

# Executables
COMPOSER=composer
NPM_EXEC=npm
DOCKER = docker
DOCKER_COMP = docker compose
DOCKER_COMPOSE_PATH = ../xis-coorporate-docker/docker-compose.yaml
# Executables: local only
SUCCESS="\x1b[32m✔︎\x1b[m"
FAILURE="\x1b[31m✗\x1b[m"

.SILENT:

install-dependencies:
	$(NPM_EXEC) i
.PHONY: install-dependencies

coffee-latte:
	$(DOCKER_COMP) -f $(DOCKER_COMPOSE_PATH) exec app bash -c "rm -rf .nuxt"
	$(DOCKER_COMP) -f $(DOCKER_COMPOSE_PATH) exec app bash -c "rm -rf .node_modules"
	$(DOCKER_COMP) -f $(DOCKER_COMPOSE_PATH) exec app bash -c "npm i"
.PHONY: coffee-latte

app-serve:
	$(DOCKER_COMP) -f $(DOCKER_COMPOSE_PATH) exec app bash -c "npm run dev"
.PHONY: app-serve

app-deploy:
	$(DOCKER_COMP) -f $(DOCKER_COMPOSE_PATH) exec app bash -c "npm run generate"
.PHONY: app-deploy

terminal:
	$(DOCKER_COMP) -f $(DOCKER_COMPOSE_PATH) exec app zsh
.PHONY: terminal