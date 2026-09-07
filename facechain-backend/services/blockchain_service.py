import json
import os
import time
from web3 import Web3
from web3.middleware import ExtraDataToPOAMiddleware
from solcx import compile_standard, install_solc
from config import Config

class BlockchainException(Exception):
    pass

_contract_cache = None

def get_web3():
    if not Config.POLYGON_RPC_URL:
        raise BlockchainException("POLYGON_RPC_URL is missing")
    w3 = Web3(Web3.HTTPProvider(Config.POLYGON_RPC_URL))
    w3.middleware_onion.inject(ExtraDataToPOAMiddleware, layer=0)
    if not w3.is_connected():
        raise BlockchainException("Failed to connect to Polygon Amoy RPC")
    return w3

def compile_contract():
    global _contract_cache
    if _contract_cache:
        return _contract_cache
        
    contract_path = os.path.join(os.path.dirname(__file__), "..", "contracts", "VerificationRegistry.sol")
    with open(contract_path, "r") as f:
        source = f.read()
        
    install_solc("0.8.0")
    compiled_sol = compile_standard({
        "language": "Solidity",
        "sources": {"VerificationRegistry.sol": {"content": source}},
        "settings": {"outputSelection": {"*": {"*": ["abi", "metadata", "evm.bytecode", "evm.sourceMap"]}}}
    }, solc_version="0.8.0")
    
    bytecode = compiled_sol["contracts"]["VerificationRegistry.sol"]["VerificationRegistry"]["evm"]["bytecode"]["object"]
    abi = compiled_sol["contracts"]["VerificationRegistry.sol"]["VerificationRegistry"]["abi"]
    
    _contract_cache = (abi, bytecode)
    return abi, bytecode

def store_verification(record_id: str, record_hash: str) -> dict:
    w3 = get_web3()
    if not Config.POLYGON_PRIVATE_KEY:
        raise BlockchainException("POLYGON_PRIVATE_KEY is missing")
        
    account = w3.eth.account.from_key(Config.POLYGON_PRIVATE_KEY)
    abi, bytecode = compile_contract()
    
    contract_address = Config.CONTRACT_ADDRESS
    
    # If no contract address provided, deploy one dynamically for demo purposes
    if not contract_address:
        print("Deploying new VerificationRegistry contract...")
        VerificationRegistry = w3.eth.contract(abi=abi, bytecode=bytecode)
        nonce = w3.eth.get_transaction_count(account.address)
        tx = VerificationRegistry.constructor().build_transaction({
            "chainId": 80002,
            "gasPrice": w3.eth.gas_price,
            "from": account.address,
            "nonce": nonce
        })
        signed_tx = w3.eth.account.sign_transaction(tx, private_key=Config.POLYGON_PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
        tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        contract_address = tx_receipt.contractAddress
        print(f"Contract deployed to: {contract_address}")
        # In a real app we'd save this, but here we just use it for this run
        
    contract = w3.eth.contract(address=contract_address, abi=abi)
    nonce = w3.eth.get_transaction_count(account.address)
    
    tx = contract.functions.storeVerification(record_id, record_hash).build_transaction({
        "chainId": 80002,
        "gasPrice": w3.eth.gas_price,
        "from": account.address,
        "nonce": nonce
    })
    
    signed_tx = w3.eth.account.sign_transaction(tx, private_key=Config.POLYGON_PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
    
    # Wait for receipt
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    
    if receipt.status != 1:
        raise BlockchainException("Transaction failed on-chain")
        
    return {
        "network": "Polygon Amoy",
        "chain_id": 80002,
        "record_hash": record_hash,
        "transaction_hash": receipt.transactionHash.hex(),
        "block_number": receipt.blockNumber,
        "status": "confirmed"
    }
