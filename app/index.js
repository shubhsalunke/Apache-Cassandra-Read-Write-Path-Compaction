const cassandra = require("cassandra-driver");

const client = new cassandra.Client({
  contactPoints: ["127.0.0.1"],
  localDataCenter: "dc1",
  keyspace: "task8_demo",
});

async function writeData() {
  console.log("Writing sample data...");

  const query = `
    INSERT INTO user_events (user_id, event_time, event_type, details)
    VALUES (?, toTimestamp(now()), ?, ?)
  `;

  for (let i = 1; i <= 1000; i++) {
    await client.execute(query, [
      `user_${i % 10}`,
      "LOGIN",
      `Sample event number ${i}`,
    ], { prepare: true });
  }

  console.log("Write completed.");
}

async function readData() {
  console.log("Reading latest 10 events for user_1...");

  const query = `
    SELECT user_id, event_time, event_type, details
    FROM user_events
    WHERE user_id = ?
    LIMIT 10
  `;

  const result = await client.execute(query, ["user_1"], { prepare: true });

  result.rows.forEach(row => console.log(row));
}

async function main() {
  try {
    await client.connect();
    await writeData();
    await readData();
    console.log("Demo completed.");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.shutdown();
  }
}

main();
