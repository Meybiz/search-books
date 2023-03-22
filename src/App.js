import React, { useState, useEffect } from 'react';
import BookCard from './BookCard';
import Spinner from './Spinner';
import './App.css';
//массивы для сортировки и категории, устанвока шага пагинации
const categories = ['all', 'art', 'biography', 'computers', 'history', 'medical', 'poetry'];
const sortOptions = ['relevance', 'newest'];
const STEP = 30;

const App = () => {
// состояния
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSortOption, setSelectedSortOption] = useState('relevance');
  const [startIndex, setStartIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // fetchBooks();
  }, [searchQuery, selectedCategory, selectedSortOption, startIndex]);
// получение данных, проброска и обновление состояния, принятие книг
  const fetchBooks = async () => {
    setIsSearching(true);
    setIsLoading(true);
    const startIndexParam = `startIndex=${startIndex}`;
    const maxResultsParam = `maxResults=${STEP}`;
    const orderByParam = `orderBy=${selectedSortOption}`;
    const queryParam = searchQuery ? `q=${searchQuery}` : '';
    const categoryParam = selectedCategory !== 'all' ? `subject:${selectedCategory}` : '';
    const url = `https://www.googleapis.com/books/v1/volumes?${queryParam}&${categoryParam}&${orderByParam}&${startIndexParam}&${maxResultsParam}&key=AIzaSyCpMEW2Enid3P2K1niVagkq4qx4ByEmFCE`;
    const response = await fetch(url);
    const data = await response.json();
    setBooks(data.items || []);
    setTotalItems(data.totalItems || 0);
    handleLoadMoreClick();
    setIsSearching(false);
    setIsLoading(false);

  };
  // кнопка поиска
  const handleSearchButtonClick = () => {
    setStartIndex(0);
    fetchBooks();
  };
  //кнопка выбора категории
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setStartIndex(0);
  };
  //кнопка выбора сортировки
  const handleSortOptionChange = (sortOption) => {
    setSelectedSortOption(sortOption);
    setStartIndex(0);
  };
  // функция для обновления состояния массива с book-list на слушатель load more
  const handleLoadMoreClick = async () => {
    setStartIndex(startIndex + STEP);
    const key = "AIzaSyCpMEW2Enid3P2K1niVagkq4qx4ByEmFCE";
    const startIndexParam = `startIndex=${startIndex + STEP}`;
    const maxResultsParam = `maxResults=${STEP}`;
    const orderByParam = `orderBy=${selectedSortOption}`;
    const queryParam = searchQuery ? `q=${searchQuery}` : '';
    const categoryParam = selectedCategory !== 'all' ? `subject:${selectedCategory}` : '';
    const url = `https://www.googleapis.com/books/v1/volumes?${queryParam}&${categoryParam}&${orderByParam}&${startIndexParam}&${maxResultsParam}&key=${key}`;
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
        <div className="search-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            placeholder="Search by book title"
          />
          <button onClick={handleSearchButtonClick} disabled={isSearching}>
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
        <div className="filter-bar">
          <div>
          <label htmlFor="category">Category:</label>
          <select id="category" value={selectedCategory} onChange={(event) => handleCategoryChange(event.target.value)}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          </div>
          <div>
          <label className='sort-label' htmlFor="sortOption">Sort by:</label>
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
      <div className="result-count">Found {totalItems} results</div>
      <div className="book-list">
        {isLoading ? <Spinner /> : books.map((book) => (
          <BookCard key={book.id} book={book.volumeInfo} />
        ))}

      </div>
      {books.length > 0 && books.length < totalItems && (
        <div className="load-more">
          <button onClick={handleLoadMoreClick}>Load more</button>
        </div>
      )}
    </div>

  );

};

export default App;