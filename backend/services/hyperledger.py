import requests

def add_to_blockchain(dict):
    res = requests.post("http://localhost:5001/hyperledger", json=dict)
    return res