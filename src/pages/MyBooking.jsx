import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyBookingData, dummyShowsData } from '../assets/assets';
import { Ticket, Clock, MapPin, CreditCard, Star, Trash2, Eye, CheckCircle, XCircle, AlertCircle, Calendar, Search, Filter } from 'lucide-react';
import BlurCircle from '../components/BlurCircle';
import timeFormat from '../lib/timeFormat';

const MyBooking = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'paid', 'unpaid', 'cancelled'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date_desc'); // 'date_asc', 'date_desc', 'price_asc', 'price_desc'
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;

  // Simulate fetching bookings for the current user
  useEffect(() => {
    const timer = setTimeout(() => {
      // Filter dummyBookingData for the current user (assuming user is "GreatStack" for demo)
      const userBookings = dummyBookingData.filter(booking => booking.user.name === "GreatStack");
      
      // Enhance bookings with movie details and add status (for demo, add random statuses)
      const enhancedBookings = userBookings.map((booking, index) => {
        const movie = dummyShowsData.find(m => m._id === booking.show.movie._id);
        const status = index % 3 === 0 ? 'cancelled' : booking.isPaid ? 'paid' : 'unpaid';
        const canCancel = !booking.isPaid && new Date(booking.show.showDateTime) > new Date(); // Can cancel if unpaid and future date
        const canRate = booking.isPaid && new Date(booking.show.showDateTime) < new Date(); // Can rate if paid and past date
        return { ...booking, movie, status, canCancel, canRate };
      });
      
      setBookings(enhancedBookings);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Filter and sort bookings
  const getFilteredBookings = () => {
    let filtered = bookings;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(b => b.status === filterStatus);
    }

    // Search by movie title or seats
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(b => 
        b.movie.title.toLowerCase().includes(lowerQuery) ||
        b.bookedSeats.join(', ').toLowerCase().includes(lowerQuery)
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date_asc':
          return new Date(a.show.showDateTime) - new Date(b.show.showDateTime);
        case 'date_desc':
          return new Date(b.show.showDateTime) - new Date(a.show.showDateTime);
        case 'price_asc':
          return a.amount - b.amount;
        case 'price_desc':
          return b.amount - a.amount;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredBookings = getFilteredBookings();
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * bookingsPerPage,
    currentPage * bookingsPerPage
  );

  // Handle cancel booking
  const handleCancel = (bookingId) => {
    if (window.confirm('Bạn có chắc muốn hủy vé này?')) {
      setBookings(prev => prev.map(b => 
        b._id === bookingId ? { ...b, status: 'cancelled', canCancel: false } : b
      ));
    }
  };

  // Handle rate movie (simulate)
  const handleRate = (movieId) => {
    alert(`Đánh giá phim ${movieId}. Chức năng này sẽ mở modal đánh giá sao và bình luận.`);
  };

  // Handle view details
  const handleViewDetails = (bookingId) => {
    alert(`Xem chi tiết booking ${bookingId}. Có thể navigate đến trang chi tiết.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <h2 className="text-white text-xl font-semibold">Đang tải lịch sử đặt vé...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 pb-12">
      <BlurCircle top="100px" left="0" />
      <BlurCircle bottom="100px" right="0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white">Lịch Sử Đặt Vé</h1>
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm phim hoặc ghế..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white focus:outline-none focus:border-red-500 transition-colors"
              >
                <option value="all">Tất cả</option>
                <option value="paid">Đã thanh toán</option>
                <option value="unpaid">Chưa thanh toán</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white focus:outline-none focus:border-red-500 transition-colors"
            >
              <option value="date_desc">Mới nhất</option>
              <option value="date_asc">Cũ nhất</option>
              <option value="price_desc">Giá cao nhất</option>
              <option value="price_asc">Giá thấp nhất</option>
            </select>
          </div>
        </div>

        {paginatedBookings.length === 0 ? (
          <div className="bg-black/20 rounded-2xl border border-white/10 p-12 text-center">
            <Ticket className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Chưa có đặt vé nào</h2>
            <p className="text-gray-400 mb-6">Hãy bắt đầu đặt vé cho bộ phim yêu thích của bạn!</p>
            <button
              onClick={() => navigate('/movies')}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
            >
              Khám phá phim
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {paginatedBookings.map((booking) => (
              <div key={booking._id} className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={booking.movie.poster_path}
                    alt={booking.movie.title}
                    className="w-full md:w-32 h-48 object-cover rounded-lg shadow-md"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-white">{booking.movie.title}</h3>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === 'paid' ? 'bg-green-500/20 text-green-300' :
                        booking.status === 'unpaid' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {booking.status === 'paid' ? 'Đã thanh toán' :
                         booking.status === 'unpaid' ? 'Chưa thanh toán' : 'Đã hủy'}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        <span>{new Date(booking.show.showDateTime).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <span>{new Date(booking.show.showDateTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-green-500" />
                        <span>Rạp XYZ - Phòng 1</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Ticket className="w-5 h-5 text-purple-500" />
                        <span>Ghế: {booking.bookedSeats.join(', ')}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-lg font-bold text-red-500">
                        Tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.amount)}
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleViewDetails(booking._id)}
                          className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {booking.canCancel && (
                          <button
                            onClick={() => handleCancel(booking._id)}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-full text-red-300 transition-colors"
                            title="Hủy vé"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                        {booking.canRate && (
                          <button
                            onClick={() => handleRate(booking.movie._id)}
                            className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-full text-yellow-300 transition-colors"
                            title="Đánh giá"
                          >
                            <Star className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  currentPage === i + 1 ? 'bg-red-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooking;