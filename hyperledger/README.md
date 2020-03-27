# Hyperledge Instructions

Follow this guide https://hyperledger-fabric.readthedocs.io/en/release-1.4/install.html to setup the docker images and replace the binaries in bin with the correct platform specific binaries.

Setup the javascript dependencies in `securebank/javascript` by typing `npm install`. Start the network in `securebank` by typing `./startFabric.sh`. Setup the admin and user by typing `node enrollAdmin.js` and `node registeryUser.js`. Test insertion and query by typing `node invoke.js` and `node query.js`. Stop the network in `securebank` by typing `./stopFabric.sh`, note this will stop the docker containers and delete the images.