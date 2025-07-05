#!/bin/bash
set -e

echo "Starting mongod in background..."
mongod --fork --logpath /var/log/mongodb.log --bind_ip_all

echo "Waiting for MongoDB to be available..."
until mongosh --eval "print('Waiting for connection...')" --quiet; do
  sleep 1
done

echo "Importing collections..."

mongoimport --db=wearify --collection=orders --file=/home/wearify/Wearify/backend/collections/wearify.orders.json --jsonArray
mongoimport --db=wearify --collection=products --file=/home/wearify/Wearify/backend/collections/wearify.products.json --jsonArray
mongoimport --db=wearify --collection=shoppingbags --file=/home/wearify/Wearify/backend/collections/wearify.shoppingbags.json --jsonArray

echo "Imports complete."

tail -f /var/log/mongodb.log
