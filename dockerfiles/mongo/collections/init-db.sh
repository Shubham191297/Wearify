#!/bin/bash
echo "[+] Importing collections into 'wearify' DB..."

mongoimport --db wearify --collection orders --file /collections/wearify.orders.json --jsonArray
mongoimport --db wearify --collection products --file /collections/wearify.products.json --jsonArray
mongoimport --db wearify --collection shoppingbags --file /collections/wearify.shoppingbags.json --jsonArray
