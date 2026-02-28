import React, { useState, useEffect } from 'react';
import { dummyShowsData, dummyDateTimeData } from '../assets/assets';
import { Calendar, Clock, Ticket, Loader2, Search, X } from 'lucide-react';
import BlurCircle from '../components/BlurCircle';
import { useNavigate } from 'react-router-dom';

const Releases = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredShows, setFilteredShows] = useState([]);
  const [showData, setShowData] = useState({});

  // Prepare show data by mapping dates and times to movies
  useEffect(() => {
    const timer = setTimeout(() => {
      const preparedData = {};
      Object.keys(dummyDateTimeData).forEach((date) => {
        preparedData[date] = dummyDateTimeData[date].map((show, index) => ({
          ...show,
          movie: dummyShowsData[index % dummyShowsData.length], // Cycle through movies for demo
        }));
      });
      setShowData(preparedData);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Filter shows based on search query (by movie title)
  useEffect(() => {
    let result = [];
    Object.keys(showData).forEach((date) => {
      const filtered = showData[date].filter((show) =>
        show.movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filtered.length > 0) {
        result.push({ date, shows: filtered });
      }
    });
    setFilteredShows(result);
  }, [showData, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
              <h2 className="text-white text-xl font-semibold mb-2">Đang tải lịch chiếu...</h2>
              <p className="text-gray-400">Vui lòng chờ trong giây lát</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 pb-12">
      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Lịch Chiếu
            </h1>
          </div>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Xem lịch chiếu phim mới nhất và đặt vé ngay hôm nay
          </p>
          <div className="flex items-center justify-center gap-8 mt-8 text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Cập nhật hàng ngày</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm phim theo tên..."
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
        </div>

        {/* Showtimes by Date */}
        {filteredShows.length > 0 ? (
          <div className="space-y-12 mb-12">
            {filteredShows.map(({ date, shows }) => (
              <div key={date}>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {new Date(date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {shows.map((show, index) => (
                    <div key={index} className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
                      <img
                        src={show.movie.backdrop_path}
                        alt={`${show.movie.title} poster`}
                        className="w-full h-48 object-cover rounded-xl mb-4"
                        loading="lazy"
                      />
                      <h3 className="font-semibold text-white text-lg mb-2">{show.movie.title}</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        {new Date(show.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} • {show.movie.genres.slice(0, 2).map(g => g.name).join(' • ')}
                      </p>
                      <button
                        onClick={() => navigate(`/movies/book/${show.movie._id}/${show.showId}`)}
                        className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium text-sm shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Ticket className="w-4 h-4" /> Đặt Vé
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-white text-2xl font-bold mb-4">Không tìm thấy lịch chiếu</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Không có lịch chiếu phù hợp với tiêu chí tìm kiếm. Hãy thử điều chỉnh từ khóa.
            </p>
            <button
              onClick={() => navigate('/movies')}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors duration-300"
            >
              Xem danh sách phim
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Releases;