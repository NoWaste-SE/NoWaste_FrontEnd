echo "Switching to branch master"
git checkout master

echo "Buliding app..."
npm run build

echo "Deploying files to server..."
scp -r build/* ubuntu@188.121.124.63:/home/ubuntu/NoWaste_FrontEnd/

echo "Done!"