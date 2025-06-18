# Setting hostname for corresponding nodes

node_number=$1
new_hostname="wearify-worker-${node_number}"

echo "$new_hostname" | sudo tee /etc/hostname
sudo hostnamectl set-hostname "$new_hostname"
sudo sed -i 's/localhost/$new_hostname/g' /etc/hosts