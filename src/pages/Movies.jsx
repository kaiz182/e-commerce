import React, { useState, useEffect } from 'react';
import { dummyShowsData } from '../assets/assets';
import MovieCard from '../components/MovieCard';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Calendar,
  Star,
  Clock,
  MapPin,
  Loader2,
  SlidersHorizontal,
  X,
  ChevronDown
} from 'lucide-react';
import BlurCircle from '../components/BlurCircle';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredMovies, setFilteredMovies] = useState([]);

  // Mock loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setMovies(dummyShowsData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter and search movies
  useEffect(() => {
    let result = [...movies];

    // Search filter
    if (searchQuery) {
      result = result.filter(movie => 
        movie.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.genre?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Genre filter
    if (selectedGenre !== 'all') {
      result = result.filter(movie => 
        movie.genre?.toLowerCase().includes(selectedGenre.toLowerCase())
      );
    }

    // Sort movies
    switch (sortBy) {
      case 'title':
        result.sort((a, b) => a.title?.localeCompare(b.title));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'latest':
      default:
        result.sort((a, b) => new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0));
        break;
    }

    setFilteredMovies(result);
  }, [movies, searchQuery, selectedGenre, sortBy]);

  // Get unique genres
  const genres = ['all', ...new Set(movies.map(movie => movie.genre).filter(Boolean))];

  const sortOptions = [
    { value: 'latest', label: 'Mới nhất' },
    { value: 'title', label: 'Tên phim A-Z' },
    { value: 'rating', label: 'Đánh giá cao' }
  ];

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedGenre('all');
    setSortBy('latest');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
              <h2 className="text-white text-xl font-semibold mb-2">Đang tải danh sách phim...</h2>
              <p className="text-gray-400">Vui lòng chờ trong giây lát</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 pb-12">
      <BlurCircle top='150px' left='0px'/>
      <BlurCircle bottom='50px' right='50px'/>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Phim Đang Chiếu
            </h1>
          </div>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Khám phá những bộ phim mới nhất và hấp dẫn nhất đang được chiếu tại rạp
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-8 text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>{movies.length} bộ phim</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Cập nhật hàng ngày</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin className="w-4 h-4 text-green-500" />
              <span>Toàn quốc</span>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-8">
          
          {/* Top Row */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm phim theo tên hoặc thể loại..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:bg-white/10 transition-all duration-300"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors duration-300"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Bộ lọc
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filter Row */}
          <div className={`lg:flex items-center gap-4 ${showFilters ? 'flex flex-col lg:flex-row' : 'hidden lg:flex'}`}>
            
            {/* Genre Filter */}
            <div className="flex-1">
              <label className="block text-gray-300 text-sm font-medium mb-2">Thể loại</label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors duration-300"
              >
                <option value="all" className="bg-gray-800">Tất cả thể loại</option>
                {genres.filter(genre => genre !== 'all').map(genre => (
                  <option key={genre} value={genre} className="bg-gray-800 capitalize">
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex-1">
              <label className="block text-gray-300 text-sm font-medium mb-2">Sắp xếp theo</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors duration-300"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-gray-800">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode */}
            <div className="flex-shrink-0">
              <label className="block text-gray-300 text-sm font-medium mb-2">Hiển thị</label>
              <div className="flex bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-red-500 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-red-500 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Clear Filters */}
            {(searchQuery || selectedGenre !== 'all' || sortBy !== 'latest') && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors duration-300"
              >
                <X className="w-4 h-4" />
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-1">
              {searchQuery ? `Kết quả tìm kiếm: "${searchQuery}"` : 'Tất cả phim'}
            </h2>
            <p className="text-gray-400">
              Tìm thấy {filteredMovies.length} bộ phim
              {selectedGenre !== 'all' && ` trong thể loại ${selectedGenre}`}
            </p>
          </div>
        </div>

        {/* Movies Grid/List */}
        {filteredMovies.length > 0 ? (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'flex flex-col gap-4'
          } mb-12`}>
            {filteredMovies.map((movie) => (
              <div 
                key={movie._id}
                className={`${
                  viewMode === 'list' 
                    ? 'transform transition-all duration-300 hover:scale-[1.02]' 
                    : ''
                }`}
              >
                <MovieCard 
                  movie={movie} 
                  viewMode={viewMode}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-white text-2xl font-bold mb-4">Không tìm thấy phim nào</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Không có phim nào phù hợp với tiêu chí tìm kiếm của bạn. 
              Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors duration-300"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}

        {/* Load More Button (if needed) */}
        {filteredMovies.length > 12 && (
          <div className="text-center">
            <button className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full transition-all duration-300 hover:scale-105">
              Xem thêm phim
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;