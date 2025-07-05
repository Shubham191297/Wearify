echo "############# Logging into docker #################"
docker logout
docker login --username shubh1917

echo "###### Building postgre image for wearify #########"
docker build -t wearify-postgre .

echo "###### Tagging postgre image for wearify #########"
docker tag wearify-postgre shubh1917/wearify-postgre:latest


echo "###### Uploading postge image for wearify to docker hub #########"
docker push shubh1917/wearify-postgre:latest