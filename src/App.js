import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryIntervalId, setRetryIntervalId] = useState(null);
  const [newMovie, setNewMovie] = useState({
    title: "",
    openingText: "",
    releaseDate: "",
  });

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://swapi.dev/api/films/");
      if (!response.ok) {
        throw new Error("Something went wrong....Retrying");
      }

      const data = await response.json();

      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });
      setMovies(transformedMovies);
    } catch (error) {
      setError(error.message);
      // Start retrying with 5-second intervals
      const intervalId = setInterval(fetchMoviesHandler, 5000);
      setRetryIntervalId(intervalId);
    }
    setIsLoading(false);
  }, []);

  const cancelRetryHandler = useCallback(() => {
    if (retryIntervalId) {
      clearInterval(retryIntervalId);
      setRetryIntervalId(null);
    }
  }, [retryIntervalId]);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  const submitHandler = (event) => {
    event.preventDefault();
    const updatedMovies = [
      ...movies,
      {
        id: Math.random().toString(),
        ...newMovie,
      },
    ];
    setMovies(updatedMovies);
    setNewMovie({
      title: "",
      openingText: "",
      releaseDate: "",
    });
  };

  const deleteMovieHandler = (movieId) => {
    setMovies((prevMovies) =>
      prevMovies.filter((movie) => movie.id !== movieId)
    );
  };

  const changeHandler = (event) => {
    const { name, value } = event.target;
    setNewMovie((prevMovie) => ({
      ...prevMovie,
      [name]: value,
    }));
  };

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} onDeleteMovie={deleteMovieHandler} />;
  }

  if (error) {
    content = (
      <React.Fragment>
        <p>{error}</p>
        <button onClick={fetchMoviesHandler}>Retry</button>
        <button onClick={cancelRetryHandler}>Cancel Retry</button>
      </React.Fragment>
    );
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <form onSubmit={submitHandler}>
          <div>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={newMovie.title}
              onChange={changeHandler}
            />
          </div>
          <div>
            <label htmlFor="openingText">Opening Text</label>
            <textarea
              id="openingText"
              name="openingText"
              value={newMovie.openingText}
              onChange={changeHandler}
            />
          </div>
          <div>
            <label htmlFor="releaseDate">Release Date</label>
            <input
              type="text"
              id="releaseDate"
              name="releaseDate"
              value={newMovie.releaseDate}
              onChange={changeHandler}
            />
          </div>
          <button type="submit">Add Movie</button>
        </form>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
