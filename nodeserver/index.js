const express = require("express");
const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');

var app = express();
app.use(express.json());

const ccpPath = path.resolve(__dirname, '..', 'hyperledger', 'first-network', 'connection-org1.json');
const walletPath = path.resolve(__dirname, '..', 'hyperledger', 'securebank', 'javascript', 'wallet');

app.post("/hyperledger", async (req, res) => {
    try {
        // Create a new file system based wallet for managing identities.
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('securebank');

        // Get passed parameters
        const id = req.body.id;
        const time = req.body.time;
        const type = req.body.type;
        const initiatedBy = req.body.initiatedBy;
        const fromAccount = req.body.fromAccount;
        const toAccount = req.body.toAccount;
        const amount = req.body.amount;
        const approvedBy = req.body.amount;

        // Submit the specified transaction.
        // createTransaction transaction - requires 8 argument
        await contract.submitTransaction('createTransaction', id, time, type, initiatedBy, fromAccount, toAccount, amount, approvedBy);
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

        res.sendStatus(200);

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        res.sendStatus(500);
    }

});

app.get("/hyperledgerquery", async (req, res) => {
    try {
        // Create a new file system based wallet for managing identities.
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('securebank');

        // Get parameters
        const minKey = req.body.minKey;
        const maxKey = req.body.maxKey;

        // Evaluate the specified transaction.
        // queryTransaction transaction - requires 1 argument, ex: ('queryTransaction', '0')
        // queryTransactions transaction - requires 2 arguments, ex: ('queryTransactions', '0', '9')
        const result = await contract.evaluateTransaction('queryTransactions', minKey, maxKey);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

        await gateway.disconnect();

        res.status(200).send(result);

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.sendStatus(500);
    }
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log("server running on port %s", PORT);
});