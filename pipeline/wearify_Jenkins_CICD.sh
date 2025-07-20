echo "==================================================================================\n"

echo "+--------------------------------------------------------------------------------+"
echo "|              WELCOME TO WEARIFY APP JENKINS CICD Automation                    |"
echo "+--------------------------------------------------------------------------------+\n"

echo "This app is deployed using jenkins CICD pipeline and it deploys the full stack web"
echo "application on kubernetes cluster that is configured on aws infrastructure build"
echo "using terraform\n"

echo "For now, we don't have fully automated pipeline 😅. So we would need your AWS"
echo "access keys to build infrastructure on your behalf and deploy the app for you 😎.\n"

read -p 'AWS_ACCESS_KEY_ID: ' aws_access_key_id
read -s -p 'AWS_SECRET_ACCESS_KEY: ' aws_secret_access_key

# echo "[default]" > ~/.aws/credentials2
# echo "aws_access_key_id = ${aws_access_key_id}" >> ~/.aws/credentials2
# echo "aws_secret_access_key = ${aws_secret_access_key}" >> ~/.aws/credentials2
echo -e "\n\nSaved your aws credentials 🔐 locally for use...😉\n"

echo "Please choose operation from below. What do you want to perform?\n"
echo "1. Save the snapshot of volume and upload it to S3 🪣"
echo "2. Mount the volume 🗂️ and deploy jenkins container for use. \n"
read -p 'Please enter: ' operationType

if [ "$operationType" -eq 1 ]; then

    docker stop wearify_jenkins
    echo "\n Stopping Jenkins pipeline container...⏱️"
    docker rm wearify_jenkins

    echo "\nPacking your current volume snapshot 💿"
    tar -cvzf jenkins_home.tgz ./jenkins_home

    echo "\nUploading to s3 remote bucket...🌥️"
    aws s3 cp ./jenkins_home.tgz s3://wearify-app-infra-state-bucket/jenkins_home.tgz
    rm -rf ./jenkins_home.tgz
    rm -rf ./jenkins_home

elif [ "$operationType" -eq 2 ]; then

    echo "\nFetching snapshot of jenkins volume from s3 🪣"
    aws s3 cp s3://wearify-app-infra-state-bucket/jenkins_home.tgz ./jenkins_home.tgz

    echo "Unpacking your volume file to be mount ready ✅"
    tar -xvzf ./jenkins_home.tgz
    rm -rf ./jenkins_home.tgz

    echo "\nYour volume is mount-ready. Want to run jenkins builder script 🧱?"
    read -p "Please select (y/n): " buildJenkins

    if [ "$buildJenkins" = "y" ]; then
    ./configureJenkins.sh
    else
    echo "Always at your service sir 🫡 . Completed the setup... Exiting now...🙃"
    fi

else
    echo "❌ Invalid input. Please enter either 1 or 2."
fi