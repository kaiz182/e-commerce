import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dummyTrailers } from '../assets/assets';
import { Play, Loader2 } from 'lucide-react';
import BlurCircle from './BlurCircle';

const Trailer = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [trailer, setTrailer] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulate finding a trailer based on movieId (simplified logic)
      const foundTrailer = dummyTrailers.find((t, index) => index % dummyTrailers.length === parseInt(movieId) % dummyTrailers.length);
      setTrailer(foundTrailer || dummyTrailers[0]); // Fallback to first trailer if not found
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [movieId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
              <h2 className="text-white text-xl font-semibold mb-2">Đang tải trailer...</h2>
              <p className="text-gray-400">Vui lòng chờ trong giây lát</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!trailer) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 px-4">
        <div className="max-w-7xl mx-auto text-center py-20">
          <h2 className="text-white text-2xl font-bold mb-4">Không tìm thấy trailer</h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Không có trailer nào cho phim này. Vui lòng quay lại sau.
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 pb-12">
      <BlurCircle top="100px" left="0" />
      <BlurCircle bottom="100px" right="0" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-4">
            Trailer - {dummyShowsData.find(m => m._id === movieId)?.title || 'Unknown Movie'}
          </h1>
          <p className="text-gray-400 text-lg">Xem trailer chính thức của phim</p>
        </div>

        <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <iframe
            src={trailer.videoUrl.replace('watch?v=', 'embed/')}
            title="Movie Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-96 rounded-xl"
          />
          <button
            onClick={() => navigate(`/movies/${movieId}`)}
            className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" /> Quay lại chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

export default Trailer;