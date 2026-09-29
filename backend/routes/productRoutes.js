const express = require("express");
const prisma = require("../prisma");

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        subcategory: true,
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
});

// Create a new product
router.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      categoryId,
      subcategoryId,
    } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        categoryId,
        subcategoryId,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create product",
    });
  }
});

// Update a product
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const {
      name,
      description,
      price,
      stock,
      categoryId,
      subcategoryId,
    } = req.body;

    const product = await prisma.product.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        price,
        stock,
        categoryId,
        subcategoryId,
      },
    });

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update product",
    });
  }
});

// Add image to a product
router.post("/:productId/images", async (req, res) => {
  try {
    const productId = Number(req.params.productId);
    const { url } = req.body;

    const image = await prisma.productImage.create({
      data: {
        url,
        productId,
      },
    });

    res.status(201).json(image);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to add product image",
    });
  }
});

module.exports = router;