echo "############# Logging into docker #################"
docker logout
docker login --username shubh1917

echo "###### Building mongodb image for wearify #########"
docker build -t wearify-mongodb -f mongoDockerfile .

echo "###### Tagginf mongodb image for wearify #########"
docker tag wearify-mongodb shubh1917/wearify-mongodb:latest


echo "###### Uploading mongodb image for wearify to docker hub #########"
docker push shubh1917/wearify-mongodb:latest