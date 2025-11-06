# Multi-stage optional (single stage kept simple)
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# System deps (if needed later) - kept minimal for now
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
 && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy source
COPY . .

# Ensure model exists (train at build time if missing)
RUN if [ ! -f category_classifier.pkl ]; then \
            echo "Training model during build..." && \
            python train_model.py; \
        else \
            echo "Existing model detected, skipping training."; \
        fi

# Default port (overridable)
ENV PORT=5002
EXPOSE 5002

# Run the service
CMD ["python", "app.py"]
