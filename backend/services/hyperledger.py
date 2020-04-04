import requests
import ast
import json

def add_to_blockchain(json):
    print("adding to block chain")

    print(json)

    res = requests.post("http://localhost:5001/hyperledger", json=json)
    
    if res.status_code == 200:
        return "success"
    else:
        return "error"

def query_ledger():
    res = requests.get("http://localhost:5001/hyperledgerquery")

    transactions = []

    ast_data = ast.literal_eval(res.text)
    for transaction in ast_data:
        transactions.append(transaction["Record"])

    return transactions
