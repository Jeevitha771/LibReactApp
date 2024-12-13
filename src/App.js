import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
  
} from "react-router-dom";
import axios from "axios";
import BookForm from "./components/BookForm";
import BookList from "./components/BookList";
import "./App.css";
import yourImage from "./librarybg.jpg";
import REACT_BACKEND_URL from "./config";
const App = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  const fetchBooks = async () => {
    const res = await axios.get(`${REACT_BACKEND_URL}/books`);
    setBooks(res.data);
  };

  const deleteBook = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );
    if (isConfirmed) {
      await axios.delete(`${REACT_BACKEND_URL}/books/${id}`);
      fetchBooks();
    }
  };

  const updateBook = async (id, updatedBookData) => {
    await axios.put(`${REACT_BACKEND_URL}/books/${id}`, updatedBookData);
    fetchBooks();
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <Router>
      <AppContent
        books={books}
        deleteBook={deleteBook}
        setSelectedBook={setSelectedBook}
        selectedBook={selectedBook}
        fetchBooks={fetchBooks}
        updateBook={updateBook}
      />
    </Router>
  );
};

const AppContent = ({
  books,
  deleteBook,
  setSelectedBook,
  selectedBook,
  fetchBooks,
  updateBook,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <img
        src={yourImage}
        alt="Library"
        style={{ width: "100%", height: "10%" }}
      />
      <div className="container">
        <h1>Library Management</h1>

        <Routes>
          <Route
            path="/bookList"
            element={
              <BookList
                books={books}
                deleteBook={deleteBook}
                setSelectedBook={setSelectedBook}
              />
            }
          />
          <Route
            path="/addBook"
            element={
              <BookForm
                fetchBooks={fetchBooks}
                selectedBook={selectedBook}
                updateBook={updateBook}
              />
            }
          />
        </Routes>

        {/* Conditionally render bottom buttons */}
        {location.pathname !== "/addBook" && (
          <div className="bottom-nav">
            <button
              onClick={() => {
                setSelectedBook(null);
                navigate("/addBook");
              }}
            >
              Add Book
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default App;
