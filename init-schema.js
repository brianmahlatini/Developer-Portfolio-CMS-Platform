const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const createSchema = async () => {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  const prisma = new PrismaClient({ adapter });

  try {
    // Test connection
    await prisma.$queryRaw`SELECT 1`;
    console.log("✓ Connected to database");

    // The tables will be automatically created by the schema
    // For now, just verify connection works
    console.log("✓ Database schema is ready for initialization");
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
};

createSchema();
