#!/bin/bash
set -e

echo "Starting mongod in background..."
mongod --fork --logpath /var/log/mongodb.log --bind_ip_all

echo "Waiting for MongoDB to be available..."
until mongo --eval "print(\"Waiting for connection...\")"; do
  sleep 1
done

echo "Importing collections..."

mongoimport --db=wearify --collection=orders --file=/home/wearify/Wearify/backend/collections/wearify.orders.json --jsonArray
mongoimport --db=wearify --collection=products --file=/home/wearify/Wearify/backend/collections/wearify.products.json --jsonArray
mongoimport --db=wearify --collection=shoppingbags --file=/home/wearify/Wearify/backend/collections/wearify.shoppingbags.json --jsonArray

echo "Imports complete."

# Now run mongod in the foreground (to keep container alive)
exec mongod --bind_ip_all

