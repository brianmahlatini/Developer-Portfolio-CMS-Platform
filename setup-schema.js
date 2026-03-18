const { Client } = require("pg");

const schema = `
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR', 'VIEWER');
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED');

CREATE TABLE "User" (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  role "Role" NOT NULL DEFAULT 'EDITOR',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Post" (
  id TEXT NOT NULL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  status "ContentStatus" NOT NULL DEFAULT 'DRAFT',
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "authorId" TEXT NOT NULL,
  FOREIGN KEY ("authorId") REFERENCES "User"(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "Project" (
  id TEXT NOT NULL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  status "ContentStatus" NOT NULL DEFAULT 'DRAFT',
  "publishedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "repoUrl" TEXT,
  "liveUrl" TEXT,
  tags TEXT[],
  "authorId" TEXT NOT NULL,
  FOREIGN KEY ("authorId") REFERENCES "User"(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "PageView" (
  id TEXT NOT NULL PRIMARY KEY,
  path TEXT NOT NULL,
  referrer TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "Post_authorId_key" ON "Post"("authorId");
CREATE INDEX "Project_authorId_key" ON "Project"("authorId");
`;

const initSchema = async () => {
  const client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "postgres",
    database: "portfolio",
  });

  try {
    await client.connect();
    console.log("✓ Connected to portfolio database");

    // Split schema by semicolon and execute each statement
    const statements = schema
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const statement of statements) {
      try {
        await client.query(statement);
        console.log("✓ Executed:", statement.substring(0, 50) + "...");
      } catch (error) {
        if (error.message.includes("already exists")) {
          console.log("✓ Already exists:", statement.substring(0, 50) + "...");
        } else {
          throw error;
        }
      }
    }

    console.log("✓ Database schema initialized successfully");
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await client.end();
  }
};

initSchema();
