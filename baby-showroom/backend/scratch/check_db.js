const mongoose = require("mongoose");
require("dotenv").config();

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  subcategory: String,
  price: Number,
  image: String,
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const count = await Product.countDocuments();
    console.log("Total products in DB:", count);
    const last = await Product.findOne().sort({_id: -1});
    console.log("Last product:", last);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
