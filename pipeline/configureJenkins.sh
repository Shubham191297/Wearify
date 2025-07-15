echo "###### Welcome to wearify jenkins builder ########\n"
echo "Please select your options from below:\n"
echo "1. Build and push jenkins image"
echo "2. Run the jenkins container"
echo "3. Do both. Build, push and then run it locally\n"
read -p 'Your choice: ' userchoice

echo "\n"

if [ "$userchoice" -eq '1' ] || [ "$userchoice" -eq '3' ]; then

echo "##### Building jenkins image for wearify deployment ########"
docker build -t wearify-jenkins .

echo "##### Please login to the docker account ########"
docker login -u shubh1917

echo "##### Tagging jenkins image for wearify app ########"
docker tag wearify-jenkins shubh1917/wearify-jenkins:latest

echo "##### Pushing jenkins image for wearify app ########"
docker push shubh1917/wearify-jenkins:latest

fi

if [ "$userchoice" -eq '2' ] || [ "$userchoice" -eq '3' ]; then

echo "##### Running jenkins container wearify app automation ########"

docker run -d --name wearify_jenkins -v ./jenkins_home:/var/jenkins_home -p 8080:8080 wearify-jenkins

fi