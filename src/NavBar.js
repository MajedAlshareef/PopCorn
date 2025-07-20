import { useEffect, useRef } from "react";
import { useKey } from "./useKey";
export function NavBar({ movies, setSearch, search }) {
  return (
    <nav className="nav-bar">
      <Logo />
      <Search setSearch={setSearch} search={search} movies={movies} />
      <NumResults movies={movies} />
    </nav>
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>Popcorn</h1>
    </div>
  );
}
function Search({ setSearch, search, movies }) {
  ////useEffect Way (NOT GOOD)
  // useEffect(() => {
  //   const element = document.querySelector(".search");
  //   element.focus();
  // }, []);
  const element = useRef(null);
  useKey("Enter", () => {
    if (document.activeElement === element.current) return;
    setSearch("");
    element.current.focus();
  });
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      ref={element}
    />
  );
}
