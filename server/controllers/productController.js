const Product = require("../models/Product");

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//bulk-upload
exports.bulkUploadProducts = async (req, res) => {
  try {
    const products = Array.isArray(req.body) ? req.body : req.body.products;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "No products to upload" });
    }

    const inserted = await Product.insertMany(products, { ordered: false });
    res
      .status(201)
      .json({ message: `${inserted.length} products added`, data: inserted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Get all products
// exports.getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find().sort({ createdAt: -1 });
//     res.status(200).json(products);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
exports.getAllProducts = async (req, res) => {
  try {
    const filter = {};

    if (req.query.stock === "0") {
      filter.quantity = 0; // Out of stock
    } else if (req.query.stock === "in") {
      filter.quantity = { $gt: 0 }; // In stock
    }

    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id.trim());
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get product by barcode
exports.getProductByBarcode = async (req, res) => {
  try {
    const { barcode } = req.params;
    const product = await Product.findOne({ barcode: barcode.trim() });

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found with this barcode" });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id.trim(),
      req.body,
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id.trim());
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
