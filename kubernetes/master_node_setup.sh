# Setting hostname for corresponding nodes

echo "============================================================================================"
echo "--------------------------- Setting up master node -----------------------------------------"
echo "============================================================================================"

echo "wearify-master" | sudo tee /etc/hostname
sudo hostnamectl set-hostname "wearify-master"
# sudo sed -i 's/localhost/wearify-master/g' /etc/hosts



echo "============================================================================================"
echo "------------------- Phase 1 - Linux Prerequisites for Kubernetes Setup ---------------------"
echo "============================================================================================"

# disable swap memory current and persisting it across reboots
sudo swapoff -a
sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab

sudo apt-get update

sudo tee /etc/modules-load.d/containerd.conf <<EOF
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

lsmod | grep -E 'br_netfilter|overlay'

sudo tee /etc/sysctl.d/kubernetes.conf <<EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
EOF

sudo sysctl --system




echo "============================================================================================"
echo "------------------------ Phase 2 - Installing Container runtime ----------------------------"
echo "============================================================================================"

sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmour -o /etc/apt/trusted.gpg.d/docker.gpg
sudo add-apt-repository -y "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

sudo apt update
sudo apt install -y containerd

sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml > /dev/null 2>&1
sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml

sudo systemctl restart containerd
sudo systemctl enable containerd




echo "============================================================================================"
echo "------------------- Phase 3 - Installing Kubectl, kubeadm & kubelet ------------------------"
echo "============================================================================================"

# apt-transport-https may be a dummy package; if so, you can skip that package
# sudo apt-get install -y apt-transport-https ca-certificates curl gpg
sudo apt install -y curl gnupg2 software-properties-common apt-transport-https ca-certificates


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
echo "------------ Phase 4 - Setting up master node & creating kubeadm cluster -------------------"
echo "============================================================================================"

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

# Sending command to worker nodes
sudo kubeadm token create --print-join-command > worker_join.sh
chmod +x worker_join.sh

chmod +x k8s-manifests/deployments/deployServices.sh
mv k8s-manifests/deployments/deployServices.sh ./
mv k8s-manifests/monitoring ./monitoring

while IFS= read -r worker_ip; do scp -i ~/.ssh/authorized_keys worker_join.sh ubuntu@"$worker_ip":/home/ubuntu; done < worker_private_ips.txt
while IFS= read -r worker_ip; do scp -i ~/.ssh/authorized_keys ./k8s-manifests/deployments/makeVolumes.sh ubuntu@"$worker_ip":/home/ubuntu; done < worker_private_ips.txt

echo "################################# COMPLETED MASTER NODE SETUP ###################################"