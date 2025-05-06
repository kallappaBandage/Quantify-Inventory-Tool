require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const methodOverride = require("method-override");

const app = express();
const PORT = 5000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.set("view engine", "ejs");


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log(" MongoDB Connected"))
.catch(err => console.error(" MongoDB Connection Error:", err));


const stockSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    stockAddedDate: { type: String, required: true },
    stockQty: { type: Number, required: true },
    stockPerQtyPrice: { type: Number, required: true },
    stockSellPerQtyPrice: { type: Number, required: true },
    stockCategory: { type: String, required: true },
    stockSupplierName: { type: String, required: true },
    stockDescription: { type: String, required: true }
});

const Stock = mongoose.model("Stock", stockSchema);


app.get("/", async (req, res) => {
    const stocks = await Stock.find();
    res.render("index", { stocks });
});


app.post("/addStock", async (req, res) => {
    try {
        const newStock = new Stock(req.body);
        await newStock.save();
        res.status(201).send("Stock Added Successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error adding stock");
    }
});


app.get("/edit-stock/:id", async (req, res) => {
    try {
        const stock = await Stock.findById(req.params.id);
        res.json(stock);
    } catch (error) {
        console.error(" Error fetching stock:", error);
        res.status(500).send("Failed to fetch stock data");
    }
});



app.put("/update-stock/:id", async (req, res) => {
    try {
        await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, message: "Stock updated successfully" });
    } catch (error) {
        console.error(" Error updating stock:", error);
        res.status(500).send("Failed to update stock");
    }
});



app.delete("/delete-stock/:id", async (req, res) => {
    try {
        await Stock.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Stock deleted successfully" });
    } catch (error) {
        console.error(" Error deleting stock:", error);
        res.status(500).send("Failed to delete stock");
    }
});


app.listen(PORT, () => {
    console.log(` Server running at http://localhost:${PORT}`);
});
