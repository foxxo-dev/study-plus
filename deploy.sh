#!/bin/bash

# Run npm build
echo "Running npm build..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
  echo "Build successful, deploying to Firebase..."
  firebase deploy
else
  echo "Build failed. Aborting deployment."
  exit 1
fi
