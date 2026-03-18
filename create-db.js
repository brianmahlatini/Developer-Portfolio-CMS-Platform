const { Client } = require("pg");

const createDatabase = async () => {
  const client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "postgres",
    database: "postgres",
  });

  try {
    await client.connect();
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'portfolio'"
    );

    if (result.rows.length === 0) {
      await client.query("CREATE DATABASE portfolio");
      console.log("✓ Database 'portfolio' created successfully");
    } else {
      console.log("✓ Database 'portfolio' already exists");
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await client.end();
  }
};

createDatabase();
