# Making volume paths for pgsql and mongodb databases.
sudo mkdir -p /mnt/postgre
sudo chown -R 999:999 /mnt/postgre

sudo mkdir -p /mnt/mongodb

sudo mkdir -p /data/backend
sudo chown -R 1000:1000 /data/backend