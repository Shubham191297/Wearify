echo "####################### Deploying Node Exporters #############################"
sleep 5
kubectl get namespace monitoring >/dev/null 2>&1 || kubectl create namespace monitoring
sleep 5
kubectl apply -f ./monitoring/node_exporter_ds.yaml


echo "####################### Deploying Prometheus prerequisites #############################"
sleep 10
kubectl apply -f ./monitoring/prometheus-serviceaccount.yaml
kubectl apply -f ./monitoring/prometheus-clusterrole.yaml
kubectl apply -f ./monitoring/prometheus-clusterrolebinding.yaml
kubectl apply -f ./monitoring/prometheus-configmap.yaml


echo "####################### Deploying Prometheus server #############################"
kubectl apply -f ./monitoring/prometheus_server.yaml


echo "####################### Restarting Prometheus (Apply Config Changes) #############################"
kubectl rollout restart deployment prometheus -n monitoring || true
kubectl rollout status deployment prometheus -n monitoring


echo "####################### Verifying Monitoring #############################"
kubectl get pods -n monitoring

# kubectl create configmap prometheus-config --from-file=prometheus.yaml=prometheus.yaml -n monitoring --dry-run=client -o yaml > prometheus-configmap.yaml