import { useEffect, useState } from "react";
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];
const KEY = "3692054b";
export function useMovies(search) {
  const [movies, setMovies] = useState(tempMovieData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${search}`, {
            signal: controller.signal,
          });
          if (!res.ok) {
            throw new Error("something went wrong with the network");
          }

          const data = await res.json();
          if (data.Response === "False") {
            throw new Error("Movie not found");
          }

          setMovies(data.Search || tempMovieData);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") setError(err);
        } finally {
          if (search.length < 3) {
            setMovies(tempMovieData);
            setIsLoading(false);
            setError("");
            return;
          }
          setIsLoading(false);
        }
      }
      fetchMovies();
      return () => controller.abort();
    },
    [search ]
  );

  return {movies ,isLoading , error}
}
