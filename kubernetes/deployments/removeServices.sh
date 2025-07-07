echo "####################### Deleting Postgre service #############################"
kubectl delete -f ~/k8s-manifests/deployments/postgres_deployment.yaml

echo "####################### Deleting Mongodb service #############################"
kubectl delete -f ~/k8s-manifests/deployments/mongodb_deployment.yaml

echo "####################### Deleting Node Backend service #############################"
kubectl delete -f ~/k8s-manifests/deployments/frontend_deployment.yaml

echo "####################### Deleting Frontend react service #############################"
kubectl delete -f ~/k8s-manifests/deployments/backend_deployment.yaml