echo "Building all the module"
echo "*****************************************"
npm run build

exit_code=$?

if [ $exit_code -ne 0 ]; then
    echo "Error building application"
fi

echo "*****************************************"
firebase deploy --only hosting:main