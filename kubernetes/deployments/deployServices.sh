echo "####################### Deploying Postgre service #############################"
sleep 5
kubectl apply -f ~/k8s-manifests/deployments/wearify-namespace.yaml
kubectl apply -f ~/k8s-manifests/deployments/postgres_deployment.yaml

echo "####################### Deploying Mongodb service #############################"
sleep 20
kubectl apply -f ~/k8s-manifests/deployments/mongodb_deployment.yaml
kubectl apply -f ~/k8s-manifests/services/mongo_service.yaml

echo "####################### Deploying Node Backend service #############################"
sleep 20
kubectl apply -f ~/k8s-manifests/deployments/backend_deployment.yaml
kubectl apply -f ~/k8s-manifests/services/backend_service.yaml

echo "####################### Deploying Frontend React service #############################"
sleep 20
kubectl apply -f ~/k8s-manifests/deployments/frontend_deployment.yaml