# 1. Helm ka GPG key add karo
curl https://baltocdn.com/helm/signing.asc | sudo apt-key add -

# 2. Helm ke official repo ko add karo
sudo apt-get install apt-transport-https --yes
echo "deb https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list

# 3. APT update karo
sudo apt-get update

# 4. Helm install karo
sudo apt-get install helm -y


# cilium-values.yaml
ipam:
  mode: kubernetes
tunnel: vxlan
containerRuntime:
  integration: containerd
k8sServiceHost: <your-api-server-ip>
k8sServicePort: 6443


helm repo add cilium https://helm.cilium.io/
helm install cilium cilium/cilium --version 1.14.5 --namespace kube-system --values cilium-values.yaml

cilium status
kubectl get pods -n kube-system | grep cilium