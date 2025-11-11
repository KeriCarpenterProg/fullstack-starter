# Makefile to streamline local development and ML service workflow
# Usage: run `make <target>` from repo root. Example: `make dev-server`

# Variables
SERVER_DIR=server
CLIENT_DIR=client
ML_DIR=ml-service
PYTHON?=python3
PORT?=5002

# Phony targets (they don't create files of same name)
.PHONY: help install-server dev-server build-server install-client dev-client build-client \
	ml-venv ml-install ml-train ml-run ml-run-reload ml-health ml-clean env-check all-install \
	dev-all stop-all

help:
	@echo "Available targets:";
	@echo "  make install-server     # npm ci in $(SERVER_DIR)"
	@echo "  make dev-server         # start backend dev server (ts-node-dev)"
	@echo "  make build-server       # tsc build backend"
	@echo "  make install-client     # npm ci in $(CLIENT_DIR)"
	@echo "  make dev-client         # start frontend (Vite)"
	@echo "  make build-client       # production build frontend"
	@echo "  make ml-venv            # create Python venv for ML service"
	@echo "  make ml-install         # install ML requirements into venv"
	@echo "  make ml-train           # train / refresh model"
	@echo "  make ml-run             # run FastAPI (python app.py) on PORT=$(PORT)"
	@echo "  make ml-run-reload      # run with uvicorn --reload on PORT=$(PORT)"
	@echo "  make ml-health          # curl ML health endpoint"
	@echo "  make env-check          # echo backend ML_SERVICE_URL via node"
	@echo "  make dev-all            # start ml (background), server, then client"
	@echo "  make all-install        # install server + client + ml requirements"
	@echo "  make stop-all           # kill processes on ports 4000, 5002, 5173"

# Back-end
install-server:
	cd $(SERVER_DIR) && npm ci

dev-server:
	cd $(SERVER_DIR) && npm run dev

build-server:
	cd $(SERVER_DIR) && npm run build

# Front-end
install-client:
	cd $(CLIENT_DIR) && npm ci

dev-client:
	cd $(CLIENT_DIR) && npm run dev

build-client:
	cd $(CLIENT_DIR) && npm run build

# ML service Python environment
ml-venv:
	cd $(ML_DIR) && $(PYTHON) -m venv venv && echo "Created venv in $(ML_DIR)/venv"

ml-install:
	cd $(ML_DIR) && . venv/bin/activate && pip install -r requirements.txt

ml-train:
	cd $(ML_DIR) && . venv/bin/activate && $(PYTHON) train_model.py

ml-run:
	cd $(ML_DIR) && . venv/bin/activate && PORT=$(PORT) $(PYTHON) app.py

ml-run-reload:
	cd $(ML_DIR) && . venv/bin/activate && pip install --quiet uvicorn[standard] && PORT=$(PORT) uvicorn app:app --reload --host 0.0.0.0 --port $(PORT)

ml-health:
	curl -sSf http://localhost:$(PORT)/health || echo "Health check failed"

# Environment checks
env-check:
	cd $(SERVER_DIR) && node -e "require('dotenv').config(); console.log(process.env.ML_SERVICE_URL || 'ML_SERVICE_URL not set')"

# Install everything (server + client + ml dependencies, no build)
all-install: install-server install-client ml-venv ml-install

# Start ml service in background, then server and client (requires venv already created)
dev-all:
	( cd $(ML_DIR) && . venv/bin/activate && PORT=$(PORT) $(PYTHON) app.py & ) ; \
	echo "Started ML service on PORT=$(PORT)" ; \
	cd $(SERVER_DIR) && npm run dev & \
	cd $(CLIENT_DIR) && npm run dev

# Clean venv (does not remove model file)
ml-clean:
	rm -rf $(ML_DIR)/venv && echo "Removed ML venv"

# Stop all running dev processes (macOS/Linux). Ignores errors if not running.
stop-all:
	@echo "Stopping processes on ports 4000, 5002, 5173 (if any)..."
	-PORTS="4000 5002 5173"; for p in $$PORTS; do \
	  PID=$$(lsof -ti tcp:$$p 2>/dev/null); \
	  if [ -n "$$PID" ]; then \
	    echo " Killing PID $$PID on port $$p"; \
	    kill $$PID 2>/dev/null || true; \
	  else \
	    echo " No process on port $$p"; \
	  fi; \
	done; \
	echo "Stop-all complete."
