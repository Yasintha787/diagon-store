const express = require("express");
const prisma = require("../prisma");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ===============================
// GET ALL PRODUCTS
// ===============================
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

// ===============================
// CREATE PRODUCT
// ===============================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      categoryId,
      subcategoryId,
    } = req.body;

    // Validation
    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Product name is required",
      });
    }

    if (
      price === undefined ||
      price === null ||
      Number(price) < 0 ||
      isNaN(Number(price))
    ) {
      return res.status(400).json({
        message: "Price must be 0 or greater",
      });
    }

    if (
      stock === undefined ||
      stock === null ||
      Number(stock) < 0 ||
      isNaN(Number(stock))
    ) {
      return res.status(400).json({
        message: "Stock must be 0 or greater",
      });
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        description,
        price: Number(price),
        stock: Number(stock),
        categoryId: categoryId ? Number(categoryId) : null,
        subcategoryId: subcategoryId ? Number(subcategoryId) : null,
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

// ===============================
// UPDATE PRODUCT
// ===============================
router.put("/:id", authMiddleware, async (req, res) => {
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

    // Validate ID
    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    // Validation
    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Product name is required",
      });
    }

    if (
      price === undefined ||
      price === null ||
      Number(price) < 0 ||
      isNaN(Number(price))
    ) {
      return res.status(400).json({
        message: "Price must be 0 or greater",
      });
    }

    if (
      stock === undefined ||
      stock === null ||
      Number(stock) < 0 ||
      isNaN(Number(stock))
    ) {
      return res.status(400).json({
        message: "Stock must be 0 or greater",
      });
    }

    const product = await prisma.product.update({
      where: {
        id,
      },
      data: {
        name: name.trim(),
        description,
        price: Number(price),
        stock: Number(stock),
        categoryId: categoryId ? Number(categoryId) : null,
        subcategoryId: subcategoryId ? Number(subcategoryId) : null,
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

// ===============================
// ADD PRODUCT IMAGE
// ===============================
router.post(
  "/:productId/images",
  authMiddleware,
  async (req, res) => {
    try {
      const productId = Number(req.params.productId);
      const { url } = req.body;

      if (isNaN(productId)) {
        return res.status(400).json({
          message: "Invalid product ID",
        });
      }

      if (!url || url.trim() === "") {
        return res.status(400).json({
          message: "Image URL is required",
        });
      }

      const image = await prisma.productImage.create({
        data: {
          url: url.trim(),
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
  }
);

// ===============================
// DELETE PRODUCT
// ===============================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    await prisma.product.delete({
      where: {
        id,
      },
    });

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete product",
    });
  }
});

module.exports = router;