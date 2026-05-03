const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================= RAZORPAY CONFIG ================= */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ================= MULTER CONFIG ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

/* ================= TEST ROUTE ================= */
app.get("/", (req, res) => {
  res.send("Server is working ✅");
});

/* ================= MONGODB ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) =>
    console.log("MongoDB Connection Error ❌:", err.message)
  );

/* ================= MODEL ================= */
const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  subcategory: String,
  price: Number,
  image: String,
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

const orderSchema = new mongoose.Schema({
  customerName: String,
  email: String,
  address: String,
  city: String,
  zip: String,
  totalAmount: Number,
  items: Array,
  paymentMethod: { type: String, default: "card" },
  createdAt: { type: Date, default: Date.now }

});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);


/* ================= GET PRODUCTS ================= */
app.get("/products", async (req, res) => {
  try {
    const data = await Product.find().sort({ _id: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= PLACE ORDER ================= */
app.post("/orders", async (req, res) => {
  try {
    console.log("📦 NEW ORDER RECEIVED:", req.body);
    const newOrder = new Order(req.body);
    await newOrder.save();

    res.status(201).json({ message: "Order placed successfully! ✅", order: newOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= RAZORPAY ORDER ================= */
app.post("/razorpay-order", async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, // Razorpay works in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= RAZORPAY VERIFY ================= */
app.post("/razorpay-verify", async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderDetails 
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment verified, save order to DB
      const newOrder = new Order({
        ...orderDetails,
        paymentMethod: "razorpay",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id
      });
      await newOrder.save();
      return res.status(200).json({ message: "Payment verified successfully! ✅" });
    } else {
      return res.status(400).json({ error: "Invalid payment signature! ❌" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= GET ORDERS ================= */
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= ADD PRODUCT ================= */
app.post("/products", upload.single("image"), async (req, res) => {
  try {
    const { name, category, subcategory, price } = req.body;
    const image = req.file ? req.file.filename : "";

    const newProduct = new Product({
      name,
      category,
      subcategory,
      price: Number(price),
      image,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully! ✅", product: newProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



/* ================= DELETE PRODUCT ================= */
app.delete("/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully! 🗑️" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= SEED DATA (🔥 FINAL VERSION) ================= */
app.get("/seed", async (req, res) => {
  try {
    console.log("🔥 NEW SEED RUNNING"); // DEBUG

    await Product.deleteMany();

    const data = [
      { category: "Girls", subs: ["Frocks", "Tops", "Jeans", "Nightwear"] },
      { category: "Boys", subs: ["Tshirts", "Shirts", "Jeans", "Nightwear"] },
      { category: "Toys", subs: ["Soft Toys", "Cars", "Dolls", "Learning Toys"] },
      { category: "Accessories", subs: ["Bath", "Care", "Feeding", "Diapers"] },
      { category: "Footwear", subs: ["Shoes", "Sandals", "Socks"] },
    ];

    const subcategoryNames = {
      "Soft Toys": [
        "Barnaby the Brave Teddy Bear",
        "Ellie the Gentle Elephant Plush",
        "Pip the Playful Penguin",
        "Luna the Magical Unicorn",
        "Oliver the Wise Owl",
        "Dash the Speedy Puppy",
        "Zelda the Zen Zebra",
        "Finn the Friendly Fox"
      ],
      "Cars": [
        "Velocity Red Formula Racer",
        "Turbo Thunder Monster Truck",
        "Elite Police Cruiser",
        "Desert Off-Road Jeep",
        "Grand Prix Sedan",
        "Solar Concept Car",
        "Midnight Sports Car",
        "Heavy Duty Loader"
      ],
      "Dolls": [
        "Adeline Companion Doll",
        "Seraphina Fairy Doll",
        "Rosie Rag Doll",
        "Dr. Joy Medical Doll",
        "Aurora Princess Doll",
        "Clementine Garden Doll"
      ],
      "Learning Toys": [
        "Geometric Blocks Kit",
        "Interactive Piano Toy",
        "Counting Abacus",
        "Solar System Map",
        "Shape Sorter Toy",
        "Creative Art Kit"
      ],
      "Frocks": [
        "Aria Silk Party Gown",
        "Chloe Lace Summer Dress",
        "Luna Floral Dress",
        "Seraphina Tulle Dress",
        "Bella Satin Gown"
      ],
      "Tops": [
        "Maya Ruffle Top",
        "Sophie Peplum Top",
        "Bella Cotton Tee",
        "Luna Graphic Top"
      ],
      "Tshirts": [
        "Captain Adventure Graphic Tee",
        "Classic Stripe Crewneck",
        "Urban Explorer Pocket Tee",
        "Dino-Mite Cotton T-shirt",
        "Vintage Sports Jersey"
      ],
      "Shirts": [
        "Oxford Button-Down Shirt",
        "Classic Plaid Flannel",
        "Grandad Collar Linen Shirt",
        "Gentleman's Dress Shirt",
        "Holiday Resort Shirt"
      ],
      "Jeans": [
        "Classic Indigo Denims",
        "Distressed Jeans",
        "Soft Stretch Denims",
        "Straight Fit Jeans"
      ],
      "Nightwear": [
        "Silk Pajama Set",
        "Cotton Sleep Dress",
        "Fleece Onesie",
        "Bamboo Sleep Set"
      ],
      "Bath": [
        "Hooded Towel", "Bamboo Washcloths", "Gentle Bubble Bath", "Rubber Duckie Set", "Bath Time Kit"
      ],
      "Care": [
        "Baby Lotion", "Bristle Brush Set", "Digital Thermometer", "Diaper Balm", "Safety Kit"
      ],
      "Feeding": [
        "Glass Bottle", "Silicone Bib", "Spoon Set", "Bottle Sterilizer", "High Chair Pad"
      ],
      "Diapers": [
        "Cloth Diapers", "Eco Disposable", "Changing Pad", "Wipe Warmer", "Diaper Bag"
      ],
      "Shoes": [
        "Performance Sneakers",
        "Leather Loafers",
        "First Walk Shoes",
        "Canvas Slip Ons"
      ],
      "Sandals": [
        "Beach Breeze Sport Sandals",
        "Classic Cork Footbed",
        "Soft Jelly Pool Shoes",
        "Leather Cross-Strap Sandals"
      ],
      "Socks": [
        "Non-Slip Grip Socks",
        "Organic Cotton Ankle Set",
        "Cozy Wool Knee Highs",
        "Frilly Lace Edge Socks"
      ]
    };

    let products = [];

    data.forEach((section) => {
      section.subs.forEach((sub) => {
        const names = subcategoryNames[sub] || [`${sub} Collection Item`];

        for (let i = 0; i < 5; i++) {
          const baseName = names[i % names.length];

          products.push({
            name: baseName, 
            category: section.category,
            subcategory: sub,
            price: Math.floor(Math.random() * 1000) + 300,
            image: `https://source.unsplash.com/featured/?baby,${sub.replace(" ", "")}&sig=${section.category}-${sub}-${i}`,
          });
        }
      });
    });

    await Product.insertMany(products);

    res.send("🔥 NEW CLEAN PRODUCTS SEEDED SUCCESSFULLY 🔥");

  } catch (err) {
    res.status(500).send(err.message);
  }
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});