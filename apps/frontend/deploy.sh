# Find the pod's name
POD_NAME=$(kubectl get pods | grep frontend-static | awk '{ print $1}')

echo $POD_NAME
yarn build
kubectl cp ./dist/index.html $POD_NAME:/usr/share/nginx/html/
kubectl cp ./dist/assets $POD_NAME:/usr/share/nginx/html/