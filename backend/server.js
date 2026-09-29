const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

app.get("/", (req, res) => {
  res.send("Diagon Store Backend is Running!");
});

const PORT = 5000;

console.log("Starting server...");

// ===============================
// 404 ROUTE HANDLER
// ===============================
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

const server = app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});

server.on("error", (error) => {
  console.error("SERVER ERROR:", error);
});

process.on("exit", (code) => {
  console.log("PROCESS EXITED:", code);
});