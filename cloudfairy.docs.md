# Cloudfairy Service (api-svc Service)

Repository url: localhost

Service Port: 8081

Kubernetes DNS Hostname: api-svc

To rollout a new container:
```bash
docker build -t api-svc:dev ././apps/webserver/Dockerfile
docker tag api-svc:dev localhost:5001/api-svc:dev
docker push localhost:5001/api-svc:dev
kubectl rollout restart deployment api-svc
```
