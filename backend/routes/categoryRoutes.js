const express = require("express");
const prisma = require("../prisma");

const router = express.Router();

// Get all categories with subcategories
router.get("/", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch categories",
    });
  }
});

// Create a new category
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
        description,
      },
    });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create category",
    });
  }
});

// Create a new subcategory
router.post("/subcategories", async (req, res) => {
  try {
    const { name, categoryId } = req.body;

    const subcategory = await prisma.subcategory.create({
      data: {
        name,
        categoryId,
      },
    });

    res.status(201).json(subcategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create subcategory",
    });
  }
});

module.exports = router;