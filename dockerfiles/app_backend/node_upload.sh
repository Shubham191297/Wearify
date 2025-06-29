echo "############# Logging into docker #################"
docker logout
docker login --username shubh1917

echo "###### Building node.js image for wearify #########"
docker build -t wearify-node --no-cache -f backendDockerfile .

echo "###### Tagging node.js image for wearify #########"
docker tag wearify-node shubh1917/wearify-backend:latest


echo "###### Uploading node.js image for wearify to docker hub #########"
docker push shubh1917/wearify-backend:latest