const { MongoClient } = require("mongodb");
//test file to check if we can connect to the database and read from it, not used in production
const uri = "";

async function test() {
  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db("StateVoter");
  const collection = db.collection("tempVotersBLO");

  const count = await collection.countDocuments();
  const sample = await collection.findOne();

  console.log("Documents:", count);
  console.log("Sample record:", sample);

  await client.close();
}

test();
