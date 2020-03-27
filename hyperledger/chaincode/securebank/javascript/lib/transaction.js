'use strict';

const { Contract } = require('fabric-contract-api');

class Transaction extends Contract {

    async initLedger(ctx) {
        
    }

    async queryTransaction(ctx, id) {
        const transaction = await ctx.stub.getState(id); // get the car from chaincode state
        if (!transaction || transaction.length === 0) {
            throw new Error(`${id} does not exist`);
        }
        return transaction.toString();
    }

    async queryTransactions(ctx, minID, maxID) {
        const iterator = await ctx.stub.getStateByRange(minID, maxID);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }

    async createTransaction(ctx, id, time, type, initiatedBy, fromAccount, toAccount, amount, approvedBy) {
        const transaction = {
            time,
            type,
            initiatedBy,
            fromAccount,
            toAccount,
            amount,
            approvedBy
        };

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(transaction)));
    }
}

module.exports = Transaction;
