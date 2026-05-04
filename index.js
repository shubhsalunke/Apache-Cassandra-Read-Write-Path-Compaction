const cassandra = require("cassandra-driver");

const client = new cassandra.Client({
  contactPoints: ["127.0.0.1"],
  localDataCenter: "dc1",
  keyspace: "task8_demo",
});

async function writeData() {
  const query = `
    INSERT INTO user_events (user_id, event_time, event_type, details)
    VALUES (?, toTimestamp(now()), ?, ?)
  `;

  for (let i = 1; i <= 1000; i++) {
    await client.execute(query, [
      `user_${i % 10}`,
      "LOGIN",
      `Sample event ${i}`,
    ], { prepare: true });
  }

  console.log("Write Completed");
}

async function readData() {
  const result = await client.execute(
    "SELECT * FROM user_events WHERE user_id=? LIMIT 10",
    ["user_1"],
    { prepare: true }
  );

  console.log(result.rows);
}

async function main() {
  await client.connect();
  await writeData();
  await readData();
  await client.shutdown();
}

main();
