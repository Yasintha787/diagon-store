const express = require("express");
const prisma = require("../prisma");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ===============================
// GET ALL CATEGORIES
// ===============================
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

// ===============================
// CREATE CATEGORY
// ===============================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validation
    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        description,
      },
    });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);

    // Duplicate category
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Category already exists",
      });
    }

    res.status(500).json({
      message: "Failed to create category",
    });
  }
});

// ===============================
// CREATE SUBCATEGORY
// ===============================
router.post("/subcategories", authMiddleware, async (req, res) => {
  try {
    const { name, categoryId } = req.body;

    // Validation
    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Subcategory name is required",
      });
    }

    if (
      categoryId === undefined ||
      categoryId === null ||
      isNaN(Number(categoryId))
    ) {
      return res.status(400).json({
        message: "Valid category ID is required",
      });
    }

    // Check category exists
    const category = await prisma.category.findUnique({
      where: {
        id: Number(categoryId),
      },
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const subcategory = await prisma.subcategory.create({
      data: {
        name: name.trim(),
        categoryId: Number(categoryId),
      },
    });

    res.status(201).json(subcategory);
  } catch (error) {
    console.error(error);

    // Duplicate subcategory in same category
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Subcategory already exists in this category",
      });
    }

    res.status(500).json({
      message: "Failed to create subcategory",
    });
  }
});
// ===============================
// DELETE CATEGORY
// ===============================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid category ID",
      });
    }

    const category = await prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    await prisma.category.delete({
      where: {
        id,
      },
    });

    res.json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete category",
    });
  }
});
// ===============================
// DELETE SUBCATEGORY
// ===============================
router.delete("/subcategories/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid subcategory ID",
      });
    }

    const subcategory = await prisma.subcategory.findUnique({
      where: {
        id,
      },
    });

    if (!subcategory) {
      return res.status(404).json({
        message: "Subcategory not found",
      });
    }

    await prisma.subcategory.delete({
      where: {
        id,
      },
    });

    res.json({
      message: "Subcategory deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete subcategory",
    });
  }
});

module.exports = router;