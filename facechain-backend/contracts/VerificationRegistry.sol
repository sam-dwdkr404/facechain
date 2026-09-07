// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VerificationRegistry {
    
    struct Record {
        string recordId;
        string recordHash;
        uint256 timestamp;
        address submitter;
    }
    
    mapping(string => Record) public records;
    
    event RecordStored(string indexed recordId, string recordHash, uint256 timestamp, address submitter);
    
    function storeVerification(string memory _recordId, string memory _recordHash) public {
        require(bytes(records[_recordId].recordId).length == 0, "Record ID already exists");
        
        records[_recordId] = Record({
            recordId: _recordId,
            recordHash: _recordHash,
            timestamp: block.timestamp,
            submitter: msg.sender
        });
        
        emit RecordStored(_recordId, _recordHash, block.timestamp, msg.sender);
    }
    
    function getVerification(string memory _recordId) public view returns (string memory, string memory, uint256, address) {
        Record memory rec = records[_recordId];
        require(bytes(rec.recordId).length != 0, "Record not found");
        return (rec.recordId, rec.recordHash, rec.timestamp, rec.submitter);
    }
}
