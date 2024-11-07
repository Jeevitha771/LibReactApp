const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); // for serving the React build
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 10000;

// CORS configuration
const corsOptions = {
  origin: "https://libreactapp-2.onrender.com",  // Allow only your frontend domain
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow only the methods you need
  allowedHeaders: ["Content-Type", "Authorization"], // Allow only the headers you need
};

app.use(cors(corsOptions)); // Apply CORS middleware with the options
// Middleware
//app.use(cors());



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
// Serve static files from React build
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all route for React frontend (non-API requests)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
