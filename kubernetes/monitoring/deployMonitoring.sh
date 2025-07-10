echo "####################### Deploying Node Exporters #############################"
sleep 5
kubectl create namespace monitoring
sleep 5
kubectl apply -f ./monitoring/node_exporter_ds.yaml

echo "####################### Deploying Prometheus server #############################"
sleep 10
kubectl apply -f ./monitoring/prometheus_server.yaml

# kubectl create configmap prometheus-config   --from-file=prometheus.yaml=prometheus.yaml   -n monitoring --dry-run=client -o yaml > prometheus-configmap.yaml