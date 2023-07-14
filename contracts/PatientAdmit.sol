// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract PatientAdmit {
    struct Patient {
        string name;
        bool isAdmitted;
    }

    mapping(address => Patient) private patients;

    function admitPatient(string memory _name) public {
        require(!patients[msg.sender].isAdmitted, "Patient is already admitted");
        
        patients[msg.sender] = Patient({
            name: _name,
            isAdmitted: true
        });

        console.log("Patient admitted: %s", _name);
    }

    function dischargePatient() public {
        require(patients[msg.sender].isAdmitted, "Patient is not admitted");

        string memory patientName = patients[msg.sender].name;
        delete patients[msg.sender];

        console.log("Patient discharged: %s", patientName);
    }

    function getPatientName() public view returns (string memory) {
        require(patients[msg.sender].isAdmitted, "Patient is not admitted");

        return patients[msg.sender].name;
    }

    function isPatientAdmitted() public view returns (bool) {
        return patients[msg.sender].isAdmitted;
    }
}
