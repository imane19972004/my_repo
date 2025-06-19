mkdir -p ./e2e-results/test-results.playwright-report
chmod -R 777 ./e2e-results
docker compose -f docker-compose-e2e.yml up --abort-on-container-exit --exit-code-from playwright
