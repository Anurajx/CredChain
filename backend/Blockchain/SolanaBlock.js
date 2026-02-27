const crypto = require("crypto");

class Block {
  constructor(index, timestamp, type, userID, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.type = type; // CREATED | UPDATED | DELETED
    this.userID = userID;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto
      .createHash("sha256")
      .update(
        this.index +
          this.timestamp +
          this.type +
          this.userID +
          JSON.stringify(this.data) +
          this.previousHash
      )
      .digest("hex");
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(
      0,
      new Date().toISOString(),
      "GENESIS",
      "SYSTEM",
      {},
      "0"
    );
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(type, userID, data) {
    const newBlock = new Block(
      this.chain.length,
      new Date().toISOString(),
      type,
      userID,
      data,
      this.getLatestBlock().hash
    );

    this.chain.push(newBlock);
    return newBlock;
  }

  /* -----------------------------------
     VOTER EVENTS (Hooked to your routes)
  ------------------------------------ */

  addCitizenCreated(data) {
    return this.addBlock("CREATED", data.ID, data);
  }

  addUserUpdate(updateArray) {
    if (!updateArray || !updateArray.length) return null;
    const updateData = updateArray[0];
    return this.addBlock("UPDATED", updateData.ID, updateData);
  }

  addCitizenDeleted(userID) {
    return this.addBlock("DELETED", userID, { deleted: true });
  }

  /* -----------------------------------
     FETCH HISTORY
  ------------------------------------ */

  getUserHistory(userID) {
    return this.chain.filter((block) => block.userID === userID);
  }

  /* -----------------------------------
     ASCII RENDER (Explorer style)
  ------------------------------------ */

  renderUserChainASCII(userID) {
    const history = this.getUserHistory(userID);

    if (!history.length) return "No blockchain history found.";

    let output = "\n=== USER BLOCKCHAIN HISTORY ===\n\n";

    history.forEach((block) => {
      output += `
----------------------------------------
Index: ${block.index}
Type: ${block.type}
Timestamp: ${block.timestamp}
UserID: ${block.userID}
Hash: ${block.hash}
Previous: ${block.previousHash}
----------------------------------------
`;
    });

    return output;
  }

  /* -----------------------------------
     FULL CHAIN VALIDATION
  ------------------------------------ */

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

module.exports = Blockchain;