IMAGE_NAME = memolink-backend
INTERNAL_PORT = 9428
EXTERNAL_PORT = 8081

.PHONY: all build run stop logs clean restart rebuild ps

all: 
	make build 
	make run

build:
	docker build -t $(IMAGE_NAME) .

run:
	docker run --name $(IMAGE_NAME) -p $(EXTERNAL_PORT):$(INTERNAL_PORT) $(IMAGE_NAME)

stop:
	docker stop $(IMAGE_NAME) || true && docker rm $(IMAGE_NAME) || true

logs:
	docker logs -f $(IMAGE_NAME)

clean:
	docker rmi -f $(IMAGE_NAME) || true

restart: stop run

rebuild: stop
	docker build --no-cache -t $(IMAGE_NAME) .
	make run

ps:
	docker ps -a | grep $(IMAGE_NAME) || true