echo "############# Logging into docker #################"
docker logout
docker login --username shubh1917

echo "###### Building reactjs image for wearify #########"
docker build -t wearify-react .

echo "###### Tagging reactjs image for wearify #########"
docker tag wearify-react shubh1917/wearify-frontend:latest


echo "###### Uploading reactjs image for wearify to docker hub #########"
docker push shubh1917/wearify-frontend:latest