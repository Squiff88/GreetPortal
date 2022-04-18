const main = async () => {
  const greetContractFactory = await hre.ethers.getContractFactory(
    "GreetPortal"
  );
  const greetContract = await greetContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await greetContract.deployed();
  const [owner, randomPerson] = await hre.ethers.getSigners();

  console.log("Contract deployed to:", greetContract.address);
  console.log("Contract deployed by:", owner.address);

  // Get Contract balance

  let contractBalance = await hre.ethers.provider.getBalance(
    greetContract.address
  );

  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  let greetCount;

  greetCount = await greetContract.getTotalGreetCount();

  console.log("before", greetCount);

  const triggerGreet = await greetContract.greet(
    "Greetings blockchain fellow 👋"
  );
  await triggerGreet.wait();

  greetCount = await greetContract.getTotalGreetCount();
  console.log("after", greetCount);
  // See if ether was send with the greet

  contractBalance = await hre.ethers.provider.getBalance(greetContract.address);

  console.log(
    "Contract balance after greet:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  // Simulate random person greeting

  const secondGreet = await greetContract
    .connect(randomPerson)
    .greet("Greetings from random user 👀");
  await secondGreet.wait();

  // See if ether was send with the greet

  contractBalance = await hre.ethers.provider.getBalance(greetContract.address);

  console.log(
    "Contract balance after greet:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  greetCount = await greetContract.getTotalGreetCount();

  console.log(greetCount, "before ..... all greets dude !");

  const deleteAGreet = await greetContract.deleteGreet(0);

  await deleteAGreet.wait();

  greetCount = await greetContract.getTotalGreetCount();

  console.log(greetCount, "after ......time greet");
};

const runMain = async () => {
  try {
    await main();
    process.exit(0); // exit Node process without error
  } catch (error) {
    console.log(error);
    process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
  }
  // Read more about Node exit ('process.exit(num)') status codes here: https://stackoverflow.com/a/47163396/7974948
};

runMain();
