import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BookForm.css";
import { useNavigate } from "react-router-dom";

const BookForm = ({ fetchBooks, selectedBook, updateBook }) => {
  const [BookName, setBookName] = useState("");
  const [Description, setDescription] = useState("");
  const [Author, setAuthor] = useState("");
  const [Comment, setComment] = useState("");
  const [Status, setStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedBook) {
      setBookName(selectedBook.BookName || "");
      setDescription(selectedBook.Description || "");
      setAuthor(selectedBook.Author || "");
      setComment(selectedBook.Comment || "");
      setStatus(selectedBook.Status || "");
    }
  }, [selectedBook]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !BookName.trim() ||
      !Description.trim() ||
      !Author.trim() ||
      !Comment.trim() ||
      !Status
    ) {
      alert("Please fill in all fields without spaces.");
      return;
    }

    const bookData = {
      BookName: BookName.trim(),
      Description: Description.trim(),
      Author: Author.trim(),
      Comment: Comment.trim(),
      Status,
    };

    if (selectedBook) {
      await updateBook(selectedBook._id, bookData);
    } else {
      await axios.post("http://localhost:5000/books", bookData);
    }

    fetchBooks();
    setBookName("");
    setDescription("");
    setAuthor("");
    setComment("");
    setStatus("");
    navigate("/bookList");
  };

  const handleCancel = () => {
    navigate("/bookList");
  };

  return (
    <div className="form-container">
      {" "}
      {}
      <form onSubmit={handleSubmit}>
        <h4>{selectedBook ? "Update Book" : "Add Book"}</h4>
        <input
          type="text"
          value={BookName}
          onChange={(e) => setBookName(e.target.value)}
          placeholder="Book Name"
          required
        />
        &nbsp;
        <input
          type="text"
          value={Description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        &nbsp;
        <input
          type="text"
          value={Author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Author"
          required
        />
        &nbsp;
        <input
          type="text"
          value={Comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Comment"
          required
        />
        &nbsp;
        <select
          value={Status}
          onChange={(e) => setStatus(e.target.value)}
          required
        >
          <option value="" disabled>
            Select Status
          </option>
          <option value="Available">Available</option>
          <option value="Borrowed">Borrowed</option>
        </select>
        &nbsp;
        <div className="button-group">
          <button type="submit">
            {selectedBook ? "Update Book" : "Add Book"}
          </button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;
