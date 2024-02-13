import React from "react";

import Movie from "./Movie";
import classes from "./MoviesList.module.css";

const MoviesList = ({ movies, onDeleteMovie }) => {
  return (
    <ul>
      {movies.map((movie) => (
        <li key={movie.id}>
          <div>
            <h2>{movie.title}</h2>
            <div>{movie.openingText}</div>
            <div>{movie.releaseDate}</div>
          </div>
          <button onClick={() => onDeleteMovie(movie.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default MoviesList;
