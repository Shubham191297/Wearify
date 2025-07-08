# Making volume paths for pgsql and mongodb databases.
sudo mkdir -p /mnt/postgre
sudo chown -R 999:999 /mnt/postgre

sudo mkdir -p /mnt/mongodb

sudo mkdir -p /mnt/backend/images
sudo mkdir -p /mnt/backend/data
sudo chown -R 1001:1001 /mnt/backend
sudo chmod -R 775 /mnt/backend
