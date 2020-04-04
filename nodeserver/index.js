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
        console.log(req.body);
        const id = req.body.id;
        const type = req.body.type;
        const fromAccount = req.body.from_account;
        const toAccount = req.body.to_account;
        const amount = req.body.amount;
        const isCritical = req.body.is_critical;
        const description = req.body.description;
        const message = req.body.message;
        const createdDate = req.body.created_date;

        // Submit the specified transaction.
        // createTransaction transaction - requires 9 argument
        await contract.submitTransaction('createTransaction', id, type, fromAccount, toAccount, amount, isCritical, description, message, createdDate);
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

        // Evaluate the specified transaction.
        // queryTransaction transaction - requires 1 argument, ex: ('queryTransaction', '0')
        // queryTransactions transaction - requires 2 arguments, ex: ('queryTransactions', '0', '9')
        const result = await contract.evaluateTransaction('queryTransactions', "", "");
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