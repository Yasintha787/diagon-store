const express = require("express");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

app.get("/", (req, res) => {
  res.send("Diagon Store Backend is Running!");
});

const PORT = 5000;

console.log("Starting Diagon Store server...");

app.listen(PORT, () => {
  console.log(`Diagon Store server running on http://localhost:${PORT}`);
});