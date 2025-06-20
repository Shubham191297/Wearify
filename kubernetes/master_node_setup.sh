# Setting hostname for corresponding nodes

echo "============================================================================================"
echo "--------------------------- Setting up master node -----------------------------------------"
echo "============================================================================================"

echo "wearify-master" | sudo tee /etc/hostname
sudo hostnamectl set-hostname "wearify-master"
# sudo sed -i 's/localhost/wearify-master/g' /etc/hosts



echo "============================================================================================"
echo "------------------------ Phase 1 - Installing Container runtime ----------------------------"
echo "============================================================================================"

# disable swap memory
sudo swapoff -a

sudo apt update
sudo apt install -y containerd

containerd config default | sudo tee /etc/containerd/config.toml > /dev/null
sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml

sudo systemctl restart containerd
sudo systemctl enable containerd






echo "============================================================================================"
echo "------------------- Phase 2 - Installing Kubectl, kubeadm & kubelet ------------------------"
echo "============================================================================================"

sudo apt-get update

# apt-transport-https may be a dummy package; if so, you can skip that package
sudo apt-get install -y apt-transport-https ca-certificates curl gpg

# Downloading the public signing key for the Kubernetes package repositories
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.33/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg

# Added latest kubernetes apt repository to get the latest packages
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.33/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list

# Installing the packages kubectl kubeadm and kubelet
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl

# enabled kubelet service
sudo systemctl enable --now kubelet






echo "============================================================================================"
echo "------------ Phase 3 - Setting up master node & creating kubeadm cluster -------------------"
echo "============================================================================================"

# Load br_netfilter module
sudo modprobe br_netfilter

# Verify it loaded
lsmod | grep br_netfilter

# Enable IPv4 forwarding and bridge-nf-call-iptables
echo '1' | sudo tee /proc/sys/net/bridge/bridge-nf-call-iptables
echo '1' | sudo tee /proc/sys/net/ipv4/ip_forward

# Persist settings across reboots
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
EOF

# Apply the sysctl settings immediately
sudo sysctl --system

# Initialize Kubernetes master node with Flannel pod network
sudo kubeadm init --pod-network-cidr=10.244.0.0/16

# Set up local kubeconfig for kubectl
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

# Remove control-plane taint so master can run pods
kubectl taint nodes --all node-role.kubernetes.io/control-plane- || true

# Apply Flannel CNI plugin
kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml

echo "################################# COMPLETED MASTER NODE SETUP ###################################"