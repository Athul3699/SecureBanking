import requests

def add_to_blockchain(json):
    res = requests.post("http://localhost:5001/hyperledger", json=json)
    return res

def query_ledger(minKey, maxKey):
    json = {"minKey": str(minKey), "maxKey": str(maxKey)}
    res = requests.get("http://localhost:5001/hyperledgerquery", json=json)
    return res
