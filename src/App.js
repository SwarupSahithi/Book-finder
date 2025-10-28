import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [selectedBook, setSelectedBook] = useState(null); // For modal

  const searchBooks = async (e) => {
    e.preventDefault();
    setError("");
    setBooks([]);

    if (!query.trim()) {
      setError("Please enter a book name!");
      return;
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}`
      );
      const data = await response.json();

      if (data.totalItems === 0) {
        setError("No books found.");
      } else {
        setBooks(data.items);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white py-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">
          📚 Sahithi’s Book Finder
        </h1>
      </nav>

      {/* Main Section */}
      <div className="max-w-5xl mx-auto p-6 text-center">
        <h2 className="text-3xl font-semibold mt-6 mb-4">Find Your Next Read</h2>

        {/* Search Bar */}
        <form onSubmit={searchBooks} className="mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search books..."
            className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>

        {/* Error Message */}
        {error && <p className="text-red-500 font-semibold">{error}</p>}

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => {
            const info = book.volumeInfo;
            return (
              <div
                key={book.id}
                onClick={() => setSelectedBook(info)}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
              >
                <img
                  src={
                    info.imageLinks?.thumbnail ||
                    "https://via.placeholder.com/150"
                  }
                  alt={info.title}
                  className="w-full h-48 object-cover rounded"
                />
                <h3 className="mt-3 font-semibold text-lg truncate">
                  {info.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {info.authors ? info.authors.join(", ") : "Unknown Author"}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Book Modal */}
      {selectedBook && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 p-6 rounded-lg shadow-lg relative">
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-2 right-3 text-gray-500 text-2xl hover:text-black"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-2">{selectedBook.title}</h2>
            <p className="text-gray-600 mb-4">
              {selectedBook.authors?.join(", ") || "Unknown Author"}
            </p>

            <img
              src={
                selectedBook.imageLinks?.thumbnail ||
                "https://via.placeholder.com/200"
              }
              alt={selectedBook.title}
              className="mx-auto mb-4 rounded"
            />

            <p className="text-sm text-gray-700 mb-2">
              <strong>Publisher:</strong> {selectedBook.publisher || "N/A"}
            </p>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Published Date:</strong>{" "}
              {selectedBook.publishedDate || "N/A"}
            </p>

            <p className="text-gray-700 text-sm mb-4 line-clamp-4">
              {selectedBook.description || "No description available."}
            </p>

            {selectedBook.previewLink && (
              <a
                href={selectedBook.previewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Preview Book
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
