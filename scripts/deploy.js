async function main() {
  const hre = require("hardhat");

  const PatientAdmit = await hre.ethers.getContractFactory("PatientAdmit");
  const patientAdmit = await PatientAdmit.deploy();

  await patientAdmit.deployed();

  console.log("PatientAdmit deployed to:", patientAdmit.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
