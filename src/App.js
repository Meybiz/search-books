import React, { useState, useEffect, useMemo } from 'react';
import BookCard from './BookCard';
import Spinner from './Spinner';
import './App.css';

const categories = ['all', 'art', 'biography', 'computers', 'history', 'medical', 'poetry'];
const sortOptions = ['relevance', 'newest'];
const STEP = 30;

const App = () => {
const [books, setBooks] = useState([]);
const [searchQuery, setSearchQuery] = useState('');
const [selectedCategory, setSelectedCategory] = useState('all');
const [selectedSortOption, setSelectedSortOption] = useState('relevance');
const [startIndex, setStartIndex] = useState(0);
const [totalItems, setTotalItems] = useState(0);
const [isSearching, setIsSearching] = useState(false);
const [isLoading, setIsLoading] = useState(false);

const queryParams = useMemo(() => {
const params = new URLSearchParams();
params.set('startIndex', startIndex);
params.set('maxResults', STEP);
params.set('orderBy', selectedSortOption);
if (searchQuery) {
params.set('q', searchQuery);
}
if (selectedCategory !== 'all') {
params.set('subject', selectedCategory);
}
return params;
}, [searchQuery, selectedCategory, selectedSortOption, startIndex]);

const fetchBooks = async () => {
setIsSearching(true);
setIsLoading(true);
const url = `https://www.googleapis.com/books/v1/volumes?${queryParams.toString()}&key=AIzaSyCpMEW2Enid3P2K1niVagkq4qx4ByEmFCE`;
const response = await fetch(url);
const data = await response.json();
setBooks(data.items || []);
setTotalItems(data.totalItems || 0);
handleLoadMoreClick();
setIsSearching(false);
setIsLoading(false);
};

useEffect(() => {
// fetchBooks();
}, [queryParams]);

const handleSearchButtonClick = () => {
setStartIndex(0);
fetchBooks();
};

const handleCategoryChange = (category) => {
setSelectedCategory(category);
setStartIndex(0);
};

const handleSortOptionChange = (sortOption) => {
setSelectedSortOption(sortOption);
setStartIndex(0);
};

const handleLoadMoreClick = async () => {
setStartIndex(startIndex + STEP);
const url = `https://www.googleapis.com/books/v1/volumes?${queryParams.toString()}&key=AIzaSyCpMEW2Enid3P2K1niVagkq4qx4ByEmFCE`;
const response = await fetch(url);
const data = await response.json();
const newBooks = data.items || [];
setBooks([...books, ...newBooks]);
};

const handleSearchInputChange = (event) => {
setSearchQuery(event.target.value);
setStartIndex(0);
};




  return (

    <div className="app">
      <div className="search-background">
        <h1>Найди свое счастье!</h1>
        <div className="search-bar">
          
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            placeholder="Поиск в базе..."
          />
          <button onClick={handleSearchButtonClick} disabled={isSearching}>
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
        <div className="filter-bar">
          <div>
          <label htmlFor="category">Категории:</label>
          <select id="category" value={selectedCategory} onChange={(event) => handleCategoryChange(event.target.value)}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          </div>
          <div>
          <label className='sort-label' htmlFor="sortOption">Сортировка:</label>
          <select id="sortOption" value={selectedSortOption} onChange={(event) => handleSortOptionChange(event.target.value)}>
            {sortOptions.map((sortOption) => (
              <option key={sortOption} value={sortOption}>
                {sortOption}
              </option>
            ))}
          </select>
          </div>
        </div>
      </div>
      <div className="result-count">Найдено {totalItems} книг</div>
      <div className="book-list">
        {isLoading ? <Spinner /> : books.map((book) => (
          <BookCard key={book.id} book={book.volumeInfo} />
        ))}

      </div>
      {books.length > 0 && books.length < totalItems && (
        <div className="load-more">
          <button onClick={handleLoadMoreClick}>Загрузить ещё</button>
        </div>
      )}
    </div>

  );

};

export default App;