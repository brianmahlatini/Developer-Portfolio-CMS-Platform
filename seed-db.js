const { Client } = require("pg");
const bcrypt = require("bcryptjs");

const seedData = async () => {
  const client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "postgres",
    database: "portfolio",
  });

  try {
    await client.connect();
    console.log("🌱 Starting database seed...");

    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin12345";
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Check if user exists
    const userResult = await client.query(
      'SELECT * FROM "User" WHERE email = $1',
      [adminEmail]
    );

    let userId;
    if (userResult.rows.length === 0) {
      // Generate a simple ID
      userId = "admin_" + Date.now();
      await client.query(
        'INSERT INTO "User" (id, name, email, "passwordHash", role, "updatedAt") VALUES ($1, $2, $3, $4, $5, $6)',
        [userId, "Admin User", adminEmail, hashedPassword, "ADMIN", new Date()]
      );
      console.log("✓ Admin user created:", adminEmail);
    } else {
      userId = userResult.rows[0].id;
      console.log("✓ Admin user already exists:", adminEmail);
    }

    // Create sample post
    const postId = "post_" + Date.now();
    const now = new Date();
    try {
      await client.query(
        'INSERT INTO "Post" (id, title, slug, summary, content, status, "publishedAt", "authorId", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
        [
          postId,
          "Welcome to My Portfolio",
          "welcome-to-portfolio",
          "My first blog post about getting started with this CMS",
          "# Welcome\n\nThis is a sample post created!",
          "PUBLISHED",
          now,
          userId,
          now,
          now,
        ]
      );
      console.log("✓ Sample post created");
    } catch (error) {
      if (error.message.includes("duplicate")) {
        console.log("✓ Sample post already exists");
      }
    }

    // Create sample project
    const projectId = "project_" + Date.now();
    try {
      await client.query(
        'INSERT INTO "Project" (id, title, slug, summary, content, status, "publishedAt", "repoUrl", "liveUrl", tags, "authorId", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
        [
          projectId,
          "Portfolio CMS Platform",
          "portfolio-cms-platform",
          "A modern CMS built with Next.js and Prisma",
          "# Portfolio CMS\n\nFull-stack CMS application",
          "PUBLISHED",
          now,
          "https://github.com/yourusername/portfolio-cms",
          "https://portfolio.example.com",
          JSON.stringify(["next.js", "prisma", "typescript"]),
          userId,
          now,
          now,
        ]
      );
      console.log("✓ Sample project created");
    } catch (error) {
      if (error.message.includes("duplicate")) {
        console.log("✓ Sample project already exists");
      }
    }

    console.log("\n✅ Database seed completed successfully!");
    console.log("\n📝 Login credentials:");
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await client.end();
  }
};

seedData();
