import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard'; // Adjust path if needed

// Sample movie data (expanded with more movies)
const movies = [
  {
    id: 1,
    title: "Inception",
    backdrop_path: "https://image.tmdb.org/t/p/w500/8ib2zML1zUr2slqQQVoUGQyWbbu.jpg",
    release_date: "2010-07-16",
    genres: [{ name: "Action" }, { name: "Sci-Fi" }],
    runtime: 148,
    vote_average: 8.8
  },
  {
    id: 2,
    title: "The Dark Knight",
    backdrop_path: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    release_date: "2008-07-18",
    genres: [{ name: "Action" }, { name: "Drama" }],
    runtime: 152,
    vote_average: 9.0
  },
  {
    id: 3,
    title: "Interstellar",
    backdrop_path: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    release_date: "2014-11-07",
    genres: [{ name: "Adventure" }, { name: "Sci-Fi" }],
    runtime: 169,
    vote_average: 8.6
  },
  {
    id: 4,
    title: "The Matrix",
    backdrop_path: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    release_date: "1999-03-31",
    genres: [{ name: "Action" }, { name: "Sci-Fi" }],
    runtime: 136,
    vote_average: 8.7
  },
  {
    id: 5,
    title: "Fight Club",
    backdrop_path: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    release_date: "1999-10-15",
    genres: [{ name: "Drama" }, { name: "Thriller" }],
    runtime: 139,
    vote_average: 8.8
  },
  {
    id: 6,
    title: "Pulp Fiction",
    backdrop_path: "https://image.tmdb.org/t/p/w500/dM2wEO0y6KcO0lU14jq2BdMnzUt.jpg",
    release_date: "1994-10-14",
    genres: [{ name: "Crime" }, { name: "Thriller" }],
    runtime: 154,
    vote_average: 8.9
  },
  {
    id: 7,
    title: "Forrest Gump",
    backdrop_path: "https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg",
    release_date: "1994-07-06",
    genres: [{ name: "Drama" }, { name: "Romance" }],
    runtime: 142,
    vote_average: 8.8
  },
  {
    id: 8,
    title: "The Shawshank Redemption",
    backdrop_path: "https://image.tmdb.org/t/p/w500/9O7gLzmreU0nGkIB6K3BsJbzvNv.jpg",
    release_date: "1994-09-23",
    genres: [{ name: "Drama" }, { name: "Crime" }],
    runtime: 142,
    vote_average: 9.3
  },
  {
    id: 9,
    title: "Gladiator",
    backdrop_path: "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmARpH1q5i3FoebC.jpg",
    release_date: "2000-05-05",
    genres: [{ name: "Action" }, { name: "Drama" }],
    runtime: 155,
    vote_average: 8.5
  },
  {
    id: 10,
    title: "The Lord of the Rings: The Return of the King",
    backdrop_path: "https://image.tmdb.org/t/p/w500/rCnzUzH6Pul2SCLrtu7wgRLowd.jpg",
    release_date: "2003-12-17",
    genres: [{ name: "Adventure" }, { name: "Fantasy" }],
    runtime: 201,
    vote_average: 8.9
  }
];

const MovieList = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const cardWidth = 272; // Approximate width of one card (w-64 + p-4 + margins)
      const scrollAmount = cardWidth * 4; // Scroll by 4 cards at a time
      const newScroll = direction === 'left' 
        ? current.scrollLeft - scrollAmount 
        : current.scrollLeft + scrollAmount;
      
      current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-8 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-white mb-6">Phim Hot</h2>
        <div className="relative">
          {/* Left Button */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800/70 text-white p-2 rounded-full hover:bg-gray-800 transition z-10 shadow-md"
            aria-label="Cuộn trái"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Movie Cards Container */}
          <div 
            ref={scrollRef}
            className="flex overflow-x-hidden space-x-4 snap-x snap-mandatory"
            style={{ scrollSnapType: 'x mandatory' }} // For smooth snapping
          >
            {movies.map((movie) => (
              <div key={movie.id} className="flex-shrink-0">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>

          {/* Right Button */}
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800/70 text-white p-2 rounded-full hover:bg-gray-800 transition z-10 shadow-md"
            aria-label="Cuộn phải"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default MovieList;