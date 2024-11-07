const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Define a simple schema
const BookSchema = new mongoose.Schema({
  BookName: {
    type: String,
    require: true,
  },
  Description: {
    type: String,
    require: true,
  },
  Author: {
    type: String,
    require: true,
  },
  Comment: {
    type: String,
    require: true,
  },
  Status: {
    type: String,
    require: true,
  },
});

const Book = mongoose.model("Books", BookSchema);

// CRUD routes
app.post("/books", async (req, res) => {
  const newBook = new Book(req.body);
  await newBook.save();
  res.json(newBook);
});

app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

app.get("/book/:id", async (req, res) => {
  const books = await Book.findById(req.params.id);
  res.json(books);
});

app.put("/books/:id", async (req, res) => {
  const updatedBook = await Book.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  await updatedBook.save();
  res.json(updatedBook);
});

app.delete("/books/:id", async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: "Book deleted" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
