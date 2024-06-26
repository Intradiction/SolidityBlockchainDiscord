const { expect } = require("chai")
const { ethers } = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether');
}

describe("Dappcord", function () {
  let deployer, user;
  let dappcord;

  const NAME = "Dappcord";
  const SYMBOL = "DC";

  beforeEach(async() => {
    // Setup accounts 
    [deployer, user] = await ethers.getSigners();

    // Deploy contract
    const Dappcord = await ethers.getContractFactory("Dappcord");
    dappcord = await Dappcord.deploy(NAME, SYMBOL);

    // Create a channel
    const transaction = await dappcord.connect(deployer).createChannel("general", tokens(1));
    await transaction.wait();

  })

  describe("Deployment", function() {
    it("Sets the name", async () => {
      let result = await dappcord.name();
      expect(result).to.equal("Dappcord");
    })

    it("Sets the symbol", async () => {
      let result = await dappcord.symbol();
      expect(result).to.equal("DC");
    })

    it("Sets the owner", async () => {
      const result = await dappcord.owner();
      expect(result).to.equal(deployer.address);
    })
  })

  describe("Creating Channels", () => {
    it('Returns total channels', async () => {
      const result = await dappcord.totalChannels();
      expect(result).to.be.equal(1)
    })

    it('Returns channel attributes', async () => {
      const channel = await dappcord.getChannel(1);
      expect(channel.id).to.be.equal(1);
      expect(channel.name).to.be.equal("general");
      expect(channel.cost).to.be.equal(tokens(1));
    })
  })
})
