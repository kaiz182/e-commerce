import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dummyShowsData, dummyTrailers, dummyDateTimeData } from '../assets/assets';
import { Star, Clock, MapPin, Ticket, Play, Loader2, Heart, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import BlurCircle from '../components/BlurCircle';
import MovieCard from '../components/MovieCard';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);

  // Fetch movie data based on ID and check favorite status
  useEffect(() => {
    const timer = setTimeout(() => {
      const selectedMovie = dummyShowsData.find((m) => m._id === id);
      setMovie(selectedMovie || null);
      const favorites = JSON.parse(localStorage.getItem('yeuThichPhim')) || [];
      setIsFavorite(favorites.some(f => f._id === id));
      
      // Simulate related movies (e.g., same genres or random slice excluding current)
      const related = dummyShowsData.filter(m => m._id !== id).slice(0, 4);
      setRelatedMovies(related);
      
      // Generate available dates (7 days from today)
      const dates = [];
      const today = new Date();
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date);
      }
      setAvailableDates(dates);
      setSelectedDate(dates[0]); // Default to today
      
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [id]);

  // Toggle favorite
  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('yeuThichPhim')) || [];
    let newFavorites;
    if (isFavorite) {
      newFavorites = favorites.filter(f => f._id !== movie._id);
    } else {
      newFavorites = [...favorites, movie];
    }
    localStorage.setItem('yeuThichPhim', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  // Format date to Vietnamese
  const formatDateVietnamese = (date) => {
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
                   'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    
    return {
      dayName: dayName,
      day: day,
      month: month,
      shortDay: dayName === 'Chủ Nhật' ? 'CN' : dayName.split(' ')[1]?.charAt(0) + (dayName.split(' ')[1]?.charAt(1) || ''),
      isToday: date.toDateString() === new Date().toDateString(),
      isTomorrow: date.toDateString() === new Date(Date.now() + 86400000).toDateString()
    };
  };

  // Get showtimes for selected date
  const getShowtimesForDate = (date) => {
    // This would be replaced with actual API call
    const times = ['10:00', '13:30', '16:00', '19:15', '22:00'];
    return times.map((time, index) => ({
      time: time,
      id: `show_${date.getTime()}_${index}`,
      available: Math.random() > 0.3 // Randomly simulate availability
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
              <h2 className="text-white text-xl font-semibold mb-2">Đang tải chi tiết phim...</h2>
              <p className="text-gray-400">Vui lòng chờ trong giây lát</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 px-4">
        <div className="max-w-7xl mx-auto text-center py-20">
          <h2 className="text-white text-2xl font-bold mb-4">Không tìm thấy phim</h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Chúng tôi không thể tìm thấy thông tin về phim này. Hãy kiểm tra lại hoặc quay lại trang chính.
          </p>
          <button
            onClick={() => navigate('/movies')}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors duration-300"
          >
            Quay lại danh sách phim
          </button>
        </div>
      </div>
    );
  }

  const currentShowtimes = selectedDate ? getShowtimesForDate(selectedDate) : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 pb-12">
      <BlurCircle top="100px" left="0" />
      <BlurCircle bottom="100px" right="0" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <img
              src={movie.backdrop_path}
              alt={`Poster phim ${movie.title}`}
              className="w-full lg:w-1/3 rounded-xl shadow-2xl object-cover h-96"
              loading="lazy"
            />
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-4">
                {movie.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-gray-300 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span>Năm {new Date(movie.release_date).getFullYear()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>{movie.vote_average?.toFixed(1) || 'Chưa có'} điểm</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-500" />
                  <span>{movie.genres.map(g => g.name).join(', ')}</span>
                </div>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                {movie.overview || 'Chưa có mô tả chi tiết cho phim này.'}
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    if (currentShowtimes.length > 0 && currentShowtimes[0].available) {
                      navigate(`/movies/book/${movie._id}/${currentShowtimes[0].id}`, {
                        state: {
                          selectedDate,
                          selectedTime: currentShowtimes[0].time
                        }
                      });
                    } else {
                      alert('Chưa có suất chiếu khả dụng cho ngày này. Vui lòng chọn ngày khác.');
                    }
                  }}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <Ticket className="w-5 h-5" /> Đặt Vé Ngay
                </button>
                <button
                  onClick={() => navigate(`/movies/trailer/${movie._id}`)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <Play className="w-5 h-5" /> Xem Trailer
                </button>
                <button
                  onClick={toggleFavorite}
                  className={`px-6 py-3 ${isFavorite ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-white/10 hover:bg-white/20'} text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2`}
                >
                  <Heart className="w-5 h-5" fill={isFavorite ? 'yellow' : 'none'} stroke="white" />
                  {isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Date Selection and Showtimes Section */}
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-bold text-white">Chọn Ngày & Suất Chiếu</h2>
          </div>
          
          {/* Date Selector */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Chọn ngày:</h3>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1">
                {availableDates.map((date, index) => {
                  const dateInfo = formatDateVietnamese(date);
                  const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                  
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      className={`min-w-[100px] p-3 rounded-xl border transition-all duration-300 ${
                        isSelected
                          ? 'bg-red-500 border-red-500 text-white'
                          : 'bg-black/30 border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="text-sm font-medium">
                        {dateInfo.isToday ? 'Hôm nay' : dateInfo.isTomorrow ? 'Ngày mai' : dateInfo.shortDay}
                      </div>
                      <div className="text-lg font-bold">{dateInfo.day}</div>
                      <div className="text-xs opacity-80">{dateInfo.month}</div>
                    </button>
                  );
                })}
              </div>
              
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Showtimes */}
          {selectedDate && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Suất chiếu ngày {formatDateVietnamese(selectedDate).day} {formatDateVietnamese(selectedDate).month}:
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {currentShowtimes.map((showtime) => (
                  <button
                    key={showtime.id}
                    onClick={() => {
                      if (showtime.available) {
                        navigate(`/movies/book/${movie._id}/${showtime.id}`, {
                          state: {
                            selectedDate,
                            selectedTime: showtime.time
                          }
                        });
                      }
                    }}
                    disabled={!showtime.available}
                    className={`p-3 rounded-lg border transition-all duration-300 ${
                      showtime.available
                        ? 'bg-green-500/20 border-green-500/50 text-green-300 hover:bg-green-500/30 hover:border-green-500'
                        : 'bg-gray-500/20 border-gray-500/50 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <div className="font-semibold">{showtime.time}</div>
                    <div className="text-xs mt-1">
                      {showtime.available ? 'Còn chỗ' : 'Hết chỗ'}
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-blue-300 text-sm">
                  💡 <strong>Lưu ý:</strong> Vui lòng có mặt tại rạp ít nhất 15 phút trước giờ chiếu. 
                  Suất chiếu có thể thay đổi mà không báo trước.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Additional Details */}
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Thông Tin Chi Tiết</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <p className="mb-2"><strong>Thời lượng:</strong> {movie.runtime} phút</p>
              <p className="mb-2"><strong>Ngày khởi chiếu:</strong> {new Date(movie.release_date).toLocaleDateString('vi-VN')}</p>
              <p className="mb-2"><strong>Slogan:</strong> {movie.tagline || 'Chưa có slogan'}</p>
            </div>
            <div>
              <p className="mb-2"><strong>Ngôn ngữ gốc:</strong> {movie.original_language.toUpperCase()}</p>
              <p className="mb-2"><strong>Lượt đánh giá:</strong> {movie.vote_count?.toLocaleString('vi-VN')} lượt</p>
              <p className="mb-2"><strong>Độ tuổi:</strong> T13 - Phù hợp từ 13 tuổi</p>
            </div>
          </div>
        </div>

        {/* Cast Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Dàn Diễn Viên</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {movie.casts.slice(0, 8).map((cast, index) => (
              <div key={index} className="text-center group">
                <img
                  src={cast.profile_path}
                  alt={cast.name}
                  className="w-24 h-24 object-cover rounded-full mx-auto mb-2 shadow-md group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
                <p className="text-gray-300 text-sm font-medium">{cast.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* You May Also Like Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Phim Bạn Có Thể Thích</h2>
            <button
              onClick={() => navigate('/movies')}
              className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 text-sm"
            >
              Xem tất cả
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedMovies.map((relatedMovie) => (
              <MovieCard key={relatedMovie._id} movie={relatedMovie} />
            ))}
          </div>
        </div>
        {/* Trailer Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Trailer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {dummyTrailers.map((trailer, index) => (
              <a
                key={index}
                href={trailer.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <img
                  src={trailer.image}
                  alt={`Trailer ${index + 1} cho ${movie.title}`}
                  className="w-full h-48 object-cover rounded-xl shadow-md transition-transform group-hover:scale-105"
                />
                <p className="text-gray-300 text-sm mt-2 text-center">Trailer {index + 1}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;