#!/usr/bin/make
# Makefile readme (en): <https://www.gnu.org/software/make/manual/html_node/index.html#SEC_Contents>

SHELL = /bin/sh

.PHONY : help build install configure

help: ## Show this help
	@echo ""
	@echo    "████████╗███████╗███████╗████████╗"
	@echo    "╚══██╔══╝██╔════╝██╔════╝╚══██╔══╝"
	@echo    "   ██║   █████╗  ███████╗   ██║   "
	@echo    "   ██║   ██╔══╝  ╚════██║   ██║   "
	@echo    "   ██║   ███████╗███████║   ██║   "
	@echo    "   ╚═╝   ╚══════╝╚══════╝   ╚═╝   "
	@echo ""
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: install configure ## Install and configure
	@echo ""
	@echo    " ██████╗ ██╗   ██╗██╗██╗     ██████╗     ██████╗  ██████╗ ███╗   ██╗███████╗ "
	@echo    " ██╔══██╗██║   ██║██║██║     ██╔══██╗    ██╔══██╗██╔═══██╗████╗  ██║██╔════╝ "
	@echo    " ██████╔╝██║   ██║██║██║     ██║  ██║    ██║  ██║██║   ██║██╔██╗ ██║█████╗   "
	@echo    " ██╔══██╗██║   ██║██║██║     ██║  ██║    ██║  ██║██║   ██║██║╚██╗██║██╔══╝   "
	@echo    " ██████╔╝╚██████╔╝██║███████╗██████╔╝    ██████╔╝╚██████╔╝██║ ╚████║███████╗ "
	@echo    " ╚═════╝  ╚═════╝ ╚═╝╚══════╝╚═════╝     ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚══════╝ "
	@echo ""

install: ## Install
	yarn install

configure: ## Configure
	cp -n .env.example .env
