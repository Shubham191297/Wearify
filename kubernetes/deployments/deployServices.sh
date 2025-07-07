echo "####################### Deploying Postgre service #############################"
sleep 5
kubectl create namespace wearify
kubectl config set-context --current --namespace=wearify
sleep 5
kubectl apply -f ~/k8s-manifests/deployments/postgres_deployment.yaml

echo "####################### Deploying Mongodb service #############################"
sleep 10
kubectl apply -f ~/k8s-manifests/deployments/mongodb_deployment.yaml

echo "####################### Deploying Node Backend service #############################"
sleep 10
kubectl apply -f ~/k8s-manifests/deployments/backend_deployment.yaml

echo "####################### Deploying Frontend React service #############################"
sleep 10
kubectl apply -f ~/k8s-manifests/deployments/frontend_deployment.yaml