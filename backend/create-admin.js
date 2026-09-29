require("dotenv/config");

const bcrypt = require("bcryptjs");
const prisma = require("./prisma");

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash("Admin@12345", 10);

    const admin = await prisma.admin.create({
      data: {
        name: "Diagon Store Admin",
        email: "admin@diagonstore.com",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("✅ Admin created successfully!");
    console.log("Email:", admin.email);
  } catch (error) {
    console.error("❌ Failed to create admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();