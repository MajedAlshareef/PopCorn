import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { NavBar } from "./NavBar";
import { useMovies } from "./useMovies";
import { useLocalStorage } from "./useLocalStorage";
import { useKey } from "./useKey";

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const KEY = "3692054b";
export default function App() {
  const [search, setSearch] = useState("");
  const [selectedMovie, setSelectedMovie] = useState({});
  // const [watched, setWatched] = useState([]);

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  function handleDeleteWatched(imdbID) {
    setWatched((prevWatched) =>
      prevWatched.filter((movie) => movie.imdbID !== imdbID)
    );
  }

  const [watched, setWatched] = useLocalStorage([], "watched");
  const { movies, isLoading, error } = useMovies(search);

  return (
    <>
      <NavBar movies={movies} setSearch={setSearch} search={search} />
      <Main
        movies={movies}
        watched={watched}
        isLoading={isLoading}
        error={error}
        setSelectedMovie={setSelectedMovie}
        selectedMovie={selectedMovie}
        handleAddWatched={handleAddWatched}
        handleDeleteWatched={handleDeleteWatched}
      />
    </>
  );
}
function Main({
  movies,
  watched,
  isLoading,
  error,
  selectedMovie,
  setSelectedMovie,
  handleAddWatched,
  handleDeleteWatched,
}) {
  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);

  function handleCloseDetails() {
    setSelectedMovie({});
  }
  return (
    <main className="main">
      <Box>
        <Button setIsOpen={setIsOpen1}>{isOpen1 ? "–" : "+"}</Button>
        {isOpen1 && (
          <>
            {isLoading && <Loader className={"loader"}>Loading...</Loader>}
            {!error && !isLoading && (
              <ListBox movies={movies} setSelectedMovie={setSelectedMovie} />
            )}
            {error && <Loader className={"error"}>⛔{error.message}</Loader>}
          </>
        )}
      </Box>
      {Object.keys(selectedMovie).length > 0 ? (
        <Box>
          <MovieDetails
            selectedMovie={selectedMovie}
            setSelectedMovie={setSelectedMovie}
            isLoading={isLoading}
            handleAddWatched={handleAddWatched}
            watched={watched}
            onClosedDetails={handleCloseDetails}
          />
        </Box>
      ) : (
        <Box>
          <Button setIsOpen={setIsOpen2}>{isOpen2 ? "–" : "+"}</Button>
          {isOpen2 && (
            <WatchedBox
              watched={watched}
              handleDeleteWatched={handleDeleteWatched}
            />
          )}
        </Box>
      )}
    </main>
  );
}
function Box({ children }) {
  return <div className="box">{children}</div>;
}
function Button({ children, setIsOpen }) {
  return (
    <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
      {children}
    </button>
  );
}
function ListBox({ movies, setSelectedMovie }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <ListBoxElement
          key={movie.imdbID}
          movie={movie}
          setSelectedMovie={setSelectedMovie}
        />
      ))}
    </ul>
  );
}
function ListBoxElement({ movie, setSelectedMovie }) {
  return (
    <li className="list-movies" onClick={() => setSelectedMovie(movie)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <p>
        <span>🗓</span>
        <span>{movie.Year}</span>
      </p>
    </li>
  );
}

function MovieDetails({
  selectedMovie,
  setSelectedMovie,
  onClosedDetails,
  handleAddWatched,
  watched,
}) {
  const [isLoading2, setIsLoading2] = useState(true);
  const [movieDetails, setMovieDetails] = useState({});
  const [movieRating, setMovieRating] = useState(0);
  const isWatched = watched
    .map((movie) => movie.imdbID)
    .includes(movieDetails.imdbID);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === movieDetails.imdbID
  )?.userRating;
  const CountRef = useRef(0);
  useEffect(() => {
    if (movieRating) CountRef.current++;
  }, [movieRating]);

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedMovie.imdbID,
      Title: selectedMovie.Title,
      Poster: selectedMovie.Poster,
      userRating: movieRating,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      ratingCount: CountRef.current,
    };
    handleAddWatched(newWatchedMovie);
    setSelectedMovie({});
  }
  useEffect(() => {
    if (!selectedMovie.imdbID) return;
    async function fetchMovieDetails() {
      try {
        setIsLoading2(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedMovie.imdbID}`
        );
        const data = await res.json();
        setMovieDetails(data);
        setIsLoading2(false);
      } catch (err) {
        console.error(err);
      }
    }

    ////you can add the handle close function here
    //  so it will close the selected movie while searching for another
    fetchMovieDetails();
  }, [selectedMovie.imdbID]);
  useEffect(() => {
    document.title = `MOVIE | ${selectedMovie.Title}`;
    return function () {
      document.title = "usePopCorn";
    };
  }, [selectedMovie.Title]);

  useKey("Escape", onClosedDetails);
  const {
    Title: title,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movieDetails;
  return isLoading2 ? (
    <Loader className={"loader"}>Loading...</Loader>
  ) : (
    <div className="details">
      <header>
        <button className="btn-back" onClick={onClosedDetails}>
          &larr;
        </button>
        <img src={poster} alt={`${title} poster`} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} &bull;{runtime}{" "}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐</span>
            {imdbRating}
          </p>
        </div>
      </header>

      <section>
        {!isWatched ? (
          <div className="rating">
            <StarRating maxRating={10} onSetRating={setMovieRating} size={24} />
            {movieRating > 0 && (
              <button className="btn-add" onClick={handleAdd}>
                Add Movie
              </button>
            )}
          </div>
        ) : (
          <p className="rating">you rated this movie by {watchedUserRating}</p>
        )}
        <p>
          <em>{plot}</em>
        </p>
        <p>Starring {actors}</p>
        <p>Directed by {director}</p>
      </section>
    </div>
  );
}

function Loader({ children, className }) {
  return <p className={className}>{children}</p>;
}
function WatchedBox({ watched, handleDeleteWatched }) {
  return (
    <>
      <WatchesSummary watched={watched} />
      <WatchedList
        watched={watched}
        handleDeleteWatched={handleDeleteWatched}
      />
    </>
  );
}
function WatchesSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
function WatchedList({ watched, handleDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedElements
          movie={movie}
          handleDeleteWatched={handleDeleteWatched}
          key={movie.imdbID}
        />
      ))}
    </ul>
  );
}
function WatchedElements({ movie, handleDeleteWatched }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <button
        className="btn-delete"
        onClick={() => handleDeleteWatched(movie.imdbID)}
      >
        X
      </button>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}
// function DisplayRating() {
//   const [movieRating, setMovieRating] = useState(0);
//   return (
//     <div>
//       <StarRating
//         onSetRating={setMovieRating}
//         messages={["not good", "bad", "Okay", "excellent", "perfect"]}
//         maxRating={5}
//         className="rating"
//       />
//       <p>you rated this movies {movieRating} /5</p>
//     </div>
//   );
// }
