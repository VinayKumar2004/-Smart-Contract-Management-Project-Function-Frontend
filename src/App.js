import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import PatientAdmit from './artifacts/contracts/PatientAdmit.sol/PatientAdmit.json';

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

export default function App() {
  const [patientName, setPatientName] = useState('');
  const [isAdmitted, setIsAdmitted] = useState(false);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask!');
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      console.log('Connected', accounts[0]);
      fetchPatientDetails();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPatientDetails = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, PatientAdmit.abi, provider);

    const name = await contract.getPatientName();
    const admitted = await contract.isPatientAdmitted();

    setPatientName(name);
    setIsAdmitted(admitted);
    console.log('Patient Details:', name, admitted);
  };

  const admitPatient = async () => {
    if (!patientName) return;
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, PatientAdmit.abi, signer);
      const transaction = await contract.admitPatient(patientName);
      await transaction.wait();
      setIsAdmitted(true);
    }
  };

  const dischargePatient = async () => {
    if (!isAdmitted) return;
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, PatientAdmit.abi, signer);
      const transaction = await contract.dischargePatient();
      await transaction.wait();
      setIsAdmitted(false);
      setPatientName('');
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchPatientDetails}>Fetch Patient Details</button>
        <button onClick={admitPatient} disabled={isAdmitted}>
          Admit Patient
        </button>
        <button onClick={dischargePatient} disabled={!isAdmitted}>
          Discharge Patient
        </button>
        <input
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          placeholder="Enter patient name"
          disabled={isAdmitted}
        />
      </header>
      {isAdmitted ? (
        <div>
          <p>Patient Name: {patientName}</p>
          <p>Status: Admitted</p>
        </div>
      ) : (
        <p>No patient admitted.</p>
      )}
    </div>
  );
}
