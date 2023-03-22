import React from 'react';

const BookCard = ({ book }) => {
  const { title, authors, categories, imageLinks} = book;


  return (
    
    <div className="book-card" onClick={() => window.open(book.infoLink)}>
      <div className="book-card__img">
        {imageLinks && imageLinks.thumbnail ? (
          <img src={imageLinks.thumbnail} alt={title} />
        ) : (
          <div className="book-card__img-placeholder"></div>
        )}
      </div>
      <div className="book-card__content">
        {categories && categories.length > 0 && (
          <div className="book-card__category">
            {categories.map((category, index) => (
              <span key={index}>{category}</span>
            ))}
          </div>
        )}
        <h3 className="book-card__title">{title}</h3>
        
        {authors && authors.length > 0 && (
          <div className="book-card__author">
            {authors.join(', ')}
          </div>
          
        )}
      </div>
    </div>
  );
};

export default BookCard;
