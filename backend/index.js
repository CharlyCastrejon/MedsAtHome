const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("Connection error:", err.message);
    process.exit(1);
  });

const MedicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  quantity: { type: Number, required: true },
  expirationDate: { type: Date, required: true },
});

const Medicine = mongoose.model("Medicine", MedicineSchema);

app.post("/medicines", async (req, res) => {
  try {
    const { name, type, quantity, expirationDate } = req.body;
    const newMedicine = new Medicine({ name, type, quantity, expirationDate });
    await newMedicine.save();
    res.status(201).send("Medicine added successfully");
  } catch (err) {
    res.status(500).send("Error adding medicine: " + err.message);
  }
});

app.get("/medicines", async (req, res) => {
    try {
      const medicines = await Medicine.find().sort({ expirationDate: 1 });
      res.status(200).json(medicines);
    } catch (error) {
      res.status(500).send("Error fetching medicines: " + error.message);
    }
  });  

app.patch("/medicines/:id/increment", async (req, res) => {
    try {
      const medicine = await Medicine.findByIdAndUpdate(
        req.params.id,
        { $inc: { quantity: 1 } },
        { new: true }
      );
      res.status(200).json(medicine);
    } catch (error) {
      res.status(500).send("Error incrementing quantity: " + error.message);
    }
  });
  
app.patch("/medicines/:id/decrement", async (req, res) => {
    try {
      const medicine = await Medicine.findById(req.params.id);
      if (medicine.quantity > 1) {
        const updatedMedicine = await Medicine.findByIdAndUpdate(
          req.params.id,
          { $inc: { quantity: -1 } },
          { new: true }
        );
        res.status(200).json(updatedMedicine);
      } else if (medicine.quantity === 1) {
        await Medicine.findByIdAndDelete(req.params.id);
        res.status(200).send("Medicine deleted as quantity reached 0");
      } else {
        res.status(400).send("Quantity cannot be less than 0");
      }
    } catch (error) {
      res.status(500).send("Error decrementing quantity: " + error.message);
    }
  });
  
app.delete("/medicines/:id", async (req, res) => {
    try {
      await Medicine.findByIdAndDelete(req.params.id);
      res.status(200).send("Medicine deleted successfully");
    } catch (error) {
      res.status(500).send("Error deleting medicine: " + error.message);
    }
  });

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
