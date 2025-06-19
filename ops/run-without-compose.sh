#!/bin/bash

echo "Building frontend"
pushd ../front-end
docker build --build-arg ENVIRONMENT=development -t memolink-frontend .
popd

echo "Building backend"
docker build -t memolink-backend .

#popd

echo "Running frontend and backend without docker-compose"
docker run -d --name memolink-frontend -p 4200:80 memolink-frontend
docker run -d --name memolink-backend -p 9428:9428 memolink-backend
echo "Frontend and backend are running"
