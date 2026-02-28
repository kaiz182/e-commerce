import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { dummyShowsData, dummyDashboardData } from '../assets/assets';
import { ArrowLeft, User, Clock, MapPin, CreditCard, Check, X, Users, Crown, Heart as HeartIcon } from 'lucide-react';
import BlurCircle from '../components/BlurCircle';

const SeatLayout = () => {
  const { movieId, showId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [movie, setMovie] = useState(null);
  const [showDetails, setShowDetails] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState({});
  const [loading, setLoading] = useState(true);
  const [bookingStep, setBookingStep] = useState('select'); // 'select', 'confirm', 'payment', 'success'
  
  // Seat configuration
  const seatRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const seatsPerRow = 14;
  const vipRows = ['F', 'G', 'H']; // VIP rows (middle section)
  const coupleRows = ['I', 'J']; // Couple seat rows (back)
  const regularRows = ['A', 'B', 'C', 'D', 'E']; // Regular seats (front)

  // Get passed data from MovieDetail or fetch fresh data
  useEffect(() => {
    const timer = setTimeout(() => {
      // Find movie
      const selectedMovie = dummyShowsData.find(m => m._id === movieId);
      setMovie(selectedMovie);

      // Create show details from passed data or generate
      if (location.state?.selectedDate && location.state?.selectedTime) {
        // Use data from MovieDetail
        setShowDetails({
          id: showId,
          movieId: movieId,
          date: location.state.selectedDate,
          time: location.state.selectedTime,
          price: 100000, // Base price in VND
          cinema: "CGV Vincom Center",
          room: "Phòng chiếu 1"
        });
      } else {
        // Generate default show details
        const today = new Date();
        setShowDetails({
          id: showId,
          movieId: movieId,
          date: today,
          time: "19:30",
          price: 100000,
          cinema: "CGV Vincom Center",
          room: "Phòng chiếu 1"
        });
      }

      // Simulate occupied seats (in real app, fetch from API)
      const occupied = {
        'A3': 'user1', 'A4': 'user1', 'A5': 'user1',
        'B8': 'user2', 'B9': 'user2',
        'C12': 'user3', 'C13': 'user3',
        'F5': 'user4', 'F6': 'user4', 'F7': 'user4', 'F8': 'user4',
        'G10': 'user5', 'G11': 'user5',
        'I3': 'user6', 'I4': 'user6',
        'J7': 'user7', 'J8': 'user7'
      };
      setOccupiedSeats(occupied);
      
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [movieId, showId, location.state]);

  // Calculate seat price based on type
  const getSeatPrice = (row) => {
    const basePrice = showDetails?.price || 100000;
    if (vipRows.includes(row)) return basePrice * 1.5;
    if (coupleRows.includes(row)) return basePrice * 2.0;
    return basePrice;
  };

  // Get seat type for styling and labeling
  const getSeatType = (row) => {
    if (vipRows.includes(row)) return 'vip';
    if (coupleRows.includes(row)) return 'couple';
    return 'regular';
  };

  // Get seat type label
  const getSeatTypeLabel = (row) => {
    if (vipRows.includes(row)) return 'VIP';
    if (coupleRows.includes(row)) return 'Đôi';
    return 'Thường';
  };

  // Handle seat selection
  const handleSeatClick = (seatId, row) => {
    if (occupiedSeats[seatId]) return; // Seat is occupied

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(seat => seat !== seatId));
    } else {
      if (selectedSeats.length >= 8) {
        alert('Bạn chỉ có thể chọn tối đa 8 ghế trong một lần đặt');
        return;
      }
      setSelectedSeats(prev => [...prev, seatId]);
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    return selectedSeats.reduce((total, seatId) => {
      const row = seatId.charAt(0);
      return total + getSeatPrice(row);
    }, 0);
  };

  // Format currency to VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Format date to Vietnamese
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle booking steps
  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      alert('Vui lòng chọn ít nhất một ghế');
      return;
    }
    setBookingStep('confirm');
  };

  const handlePayment = () => {
    setBookingStep('payment');
    // Simulate payment process
    setTimeout(() => {
      setBookingStep('success');
      // Update occupied seats
      const newOccupied = { ...occupiedSeats };
      selectedSeats.forEach(seat => {
        newOccupied[seat] = 'current_user';
      });
      setOccupiedSeats(newOccupied);
    }, 3000);
  };

  const handleBackToMovies = () => {
    navigate('/movies');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Đang tải sơ đồ rạp...</p>
        </div>
      </div>
    );
  }

  if (!movie || !showDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold mb-4">Không tìm thấy thông tin</h2>
          <button
            onClick={() => navigate('/movies')}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
          >
            Quay lại danh sách phim
          </button>
        </div>
      </div>
    );
  }

  if (bookingStep === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Đặt vé thành công!</h2>
          <div className="bg-black/20 rounded-xl p-6 mb-6">
            <p className="text-gray-300 mb-2"><strong>Phim:</strong> {movie.title}</p>
            <p className="text-gray-300 mb-2"><strong>Ngày:</strong> {formatDate(showDetails.date)}</p>
            <p className="text-gray-300 mb-2"><strong>Giờ:</strong> {showDetails.time}</p>
            <p className="text-gray-300 mb-2"><strong>Ghế:</strong> {selectedSeats.join(', ')}</p>
            <p className="text-green-400 font-bold text-xl"><strong>Tổng:</strong> {formatPrice(calculateTotal())}</p>
          </div>
          <p className="text-gray-400 mb-6 text-sm">
            Vé điện tử đã được gửi vào email của bạn. Vui lòng có mặt tại rạp ít nhất 15 phút trước giờ chiếu.
          </p>
          <button
            onClick={handleBackToMovies}
            className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 pb-12">
      <BlurCircle top="100px" left="0" />
      <BlurCircle bottom="100px" right="0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(`/movies/detail/${movieId}`)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">{movie.title}</h1>
            <p className="text-gray-400 flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDate(showDetails.date)} - {showDetails.time}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {showDetails.cinema} - {showDetails.room}
              </span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Seat Selection */}
          <div className="lg:col-span-3">
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              {bookingStep === 'select' && (
                <>
                  {/* Screen */}
                  <div className="mb-8 text-center">
                    <div className="w-full max-w-4xl mx-auto h-2 bg-gradient-to-r from-transparent via-white to-transparent rounded-full mb-3"></div>
                    <p className="text-gray-400 text-sm font-medium">MÀN HÌNH CHIẾU</p>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap justify-center gap-4 mb-8 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-600 rounded-sm"></div>
                      <span className="text-gray-300">Trống</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
                      <span className="text-gray-300">Đã đặt</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                      <span className="text-gray-300">Đang chọn</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded-sm"></div>
                      <span className="text-gray-300">VIP (+50%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-pink-500 rounded-sm"></div>
                      <span className="text-gray-300">Ghế đôi (+100%)</span>
                    </div>
                  </div>

                  {/* Seats */}
                  <div className="space-y-4">
                    {seatRows.map(row => {
                      const seatType = getSeatType(row);
                      return (
                        <div key={row} className="flex justify-center items-center gap-2">
                          <div className="w-8 text-center text-gray-300 font-semibold text-sm">{row}</div>
                          <div className="flex gap-1">
                            {/* Left section */}
                            {Array.from({ length: Math.floor(seatsPerRow / 2) - 1 }, (_, index) => {
                              const seatNumber = index + 1;
                              const seatId = `${row}${seatNumber}`;
                              const isOccupied = occupiedSeats[seatId];
                              const isSelected = selectedSeats.includes(seatId);
                              
                              let seatClass = 'w-8 h-8 rounded-sm cursor-pointer transition-all duration-200 flex items-center justify-center text-xs font-bold hover:scale-110 ';
                              
                              if (isOccupied) {
                                seatClass += 'bg-red-500 text-white cursor-not-allowed';
                              } else if (isSelected) {
                                seatClass += 'bg-blue-500 text-white shadow-lg';
                              } else {
                                if (seatType === 'vip') {
                                  seatClass += 'bg-yellow-500/20 border border-yellow-500 text-yellow-300 hover:bg-yellow-500/40';
                                } else if (seatType === 'couple') {
                                  seatClass += 'bg-pink-500/20 border border-pink-500 text-pink-300 hover:bg-pink-500/40';
                                } else {
                                  seatClass += 'bg-gray-600 text-white hover:bg-gray-500';
                                }
                              }

                              return (
                                <div
                                  key={seatId}
                                  className={seatClass}
                                  onClick={() => handleSeatClick(seatId, row)}
                                  title={`${seatId} - ${getSeatTypeLabel(row)} - ${formatPrice(getSeatPrice(row))}`}
                                >
                                  {seatNumber}
                                </div>
                              );
                            })}
                            
                            {/* Aisle */}
                            <div className="w-6"></div>
                            
                            {/* Right section */}
                            {Array.from({ length: Math.floor(seatsPerRow / 2) + 1 }, (_, index) => {
                              const seatNumber = Math.floor(seatsPerRow / 2) + index;
                              const seatId = `${row}${seatNumber}`;
                              const isOccupied = occupiedSeats[seatId];
                              const isSelected = selectedSeats.includes(seatId);
                              
                              let seatClass = 'w-8 h-8 rounded-sm cursor-pointer transition-all duration-200 flex items-center justify-center text-xs font-bold hover:scale-110 ';
                              
                              if (isOccupied) {
                                seatClass += 'bg-red-500 text-white cursor-not-allowed';
                              } else if (isSelected) {
                                seatClass += 'bg-blue-500 text-white shadow-lg';
                              } else {
                                if (seatType === 'vip') {
                                  seatClass += 'bg-yellow-500/20 border border-yellow-500 text-yellow-300 hover:bg-yellow-500/40';
                                } else if (seatType === 'couple') {
                                  seatClass += 'bg-pink-500/20 border border-pink-500 text-pink-300 hover:bg-pink-500/40';
                                } else {
                                  seatClass += 'bg-gray-600 text-white hover:bg-gray-500';
                                }
                              }

                              return (
                                <div
                                  key={seatId}
                                  className={seatClass}
                                  onClick={() => handleSeatClick(seatId, row)}
                                  title={`${seatId} - ${getSeatTypeLabel(row)} - ${formatPrice(getSeatPrice(row))}`}
                                >
                                  {seatNumber}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pricing Info */}
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                      <Users className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Ghế thường</p>
                      <p className="text-white font-bold">{formatPrice(showDetails.price)}</p>
                    </div>
                    <div className="bg-yellow-800/50 rounded-xl p-4 text-center">
                      <Crown className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Ghế VIP</p>
                      <p className="text-white font-bold">{formatPrice(showDetails.price * 1.5)}</p>
                    </div>
                    <div className="bg-pink-800/50 rounded-xl p-4 text-center">
                      <HeartIcon className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Ghế đôi</p>
                      <p className="text-white font-bold">{formatPrice(showDetails.price * 2)}</p>
                    </div>
                  </div>
                </>
              )}

              {bookingStep === 'confirm' && (
                <div className="text-center py-12">
                  <h3 className="text-2xl font-bold text-white mb-8">Xác nhận thông tin đặt vé</h3>
                  <div className="max-w-md mx-auto bg-gray-800/50 rounded-xl p-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Phim:</span>
                      <span className="text-white font-semibold">{movie.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Ngày giờ:</span>
                      <span className="text-white">{formatDate(showDetails.date)} - {showDetails.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Rạp:</span>
                      <span className="text-white">{showDetails.cinema}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Ghế:</span>
                      <span className="text-white font-semibold">{selectedSeats.join(', ')}</span>
                    </div>
                    <div className="border-t border-gray-600 pt-4">
                      <div className="flex justify-between text-lg">
                        <span className="text-gray-400">Tổng tiền:</span>
                        <span className="text-red-500 font-bold">{formatPrice(calculateTotal())}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {bookingStep === 'payment' && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-6"></div>
                  <h3 className="text-2xl font-bold text-white mb-4">Đang xử lý thanh toán...</h3>
                  <p className="text-gray-400">Vui lòng không tắt trang web trong quá trình thanh toán</p>
                </div>
              )}
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-white mb-6">Thông tin đặt vé</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex gap-3">
                  <img 
                    src={movie.poster_path} 
                    alt={movie.title}
                    className="w-16 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-sm mb-1">{movie.title}</h4>
                    <p className="text-gray-400 text-xs">{showDetails.cinema}</p>
                    <p className="text-gray-400 text-xs">{showDetails.room}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Ngày:</span>
                    <span className="text-white">{new Date(showDetails.date).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Giờ:</span>
                    <span className="text-white">{showDetails.time}</span>
                  </div>
                </div>
              </div>

              {selectedSeats.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Ghế đã chọn:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats.map(seat => (
                      <span key={seat} className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
                        {seat}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                    {selectedSeats.map(seat => {
                      const row = seat.charAt(0);
                      const type = getSeatTypeLabel(row);
                      const price = getSeatPrice(row);
                      return (
                        <div key={seat} className="flex justify-between text-gray-300">
                          <span>{seat} ({type})</span>
                          <span>{formatPrice(price)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="border-t border-gray-600 pt-4">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-400">Tổng tiền:</span>
                  <span className="text-2xl font-bold text-red-500">{formatPrice(calculateTotal())}</span>
                </div>
                
                {bookingStep === 'select' && (
                  <button
                    onClick={handleContinue}
                    disabled={selectedSeats.length === 0}
                    className="w-full py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-full transition-colors"
                  >
                    {selectedSeats.length === 0 ? 'Chọn ghế để tiếp tục' : 'Tiếp tục'}
                  </button>
                )}

                {bookingStep === 'confirm' && (
                  <div className="space-y-3">
                    <button
                      onClick={handlePayment}
                      className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full transition-colors"
                    >
                      Thanh toán
                    </button>
                    <button
                      onClick={() => setBookingStep('select')}
                      className="w-full py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-full transition-colors"
                    >
                      Quay lại
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatLayout;