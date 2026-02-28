import React, { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  SkipBack, 
  SkipForward,
  Maximize,
  Clock,
  Eye
} from 'lucide-react';
import BlurCircle from './BlurCircle';
import { trailers } from '../components/data/trailersData';
import { useYouTubePlayer } from '../components/data/useYouTubePlayer';

const TrailerSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(trailers[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);
  
  const {
    isPlaying,
    isMuted,
    isReady,
    setIsReady,
    onReady,
    onStateChange,
    onError,
    togglePlayPause,
    toggleMute
  } = useYouTubePlayer();

  const playerOptions = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 1,
      iv_load_policy: 3,
      modestbranding: 1,
      playsinline: 1,
      rel: 0,
      origin: window.location.origin,
      quality: 'hd1080'
    }
  };

  // Auto-hide controls
  useEffect(() => {
    if (showControls && isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, isPlaying]);

  const changeTrailer = (trailer, index) => {
    if (currentTrailer.id === trailer.id) return;
    
    setIsLoading(true);
    setCurrentTrailer(trailer);
    setCurrentIndex(index);
    setIsReady(false);
    setShowControls(true);
    
    setTimeout(() => setIsLoading(false), 500);
  };

  const nextTrailer = () => {
    const nextIndex = (currentIndex + 1) % trailers.length;
    changeTrailer(trailers[nextIndex], nextIndex);
  };

  const prevTrailer = () => {
    const prevIndex = currentIndex === 0 ? trailers.length - 1 : currentIndex - 1;
    changeTrailer(trailers[prevIndex], prevIndex);
  };

  const handlePlayerHover = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 px-4 md:px-8 lg:px-16 py-12">
      {/* Animated Background Elements */}
      <BlurCircle top="-200px" right="-200px" className="opacity-30" />
      <BlurCircle bottom="-150px" left="-150px" className="opacity-20" />
      
      {/* Header Section */}
      <div className="text-center mb-16 relative">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
            <Play className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            Trailer Cinema
          </h1>
        </div>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Khám phá thế giới điện ảnh qua những trailer chất lượng cao nhất
        </p>
      </div>

      {/* Main Player Section */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="relative group">
          {/* Player Container */}
          <div 
            className="relative bg-black rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 transition-all duration-500 hover:ring-red-500/30 hover:shadow-red-500/20"
            onMouseEnter={handlePlayerHover}
            onMouseLeave={() => setShowControls(false)}
          >
            <div className="aspect-video relative">
              {/* YouTube Player */}
              <YouTube
                key={currentTrailer.id}
                videoId={currentTrailer.id}
                opts={playerOptions}
                onReady={onReady}
                onStateChange={onStateChange}
                onError={onError}
                className="w-full h-full"
              />

              {/* Loading Overlay */}
              {(isLoading || !isReady) && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 to-black/95 flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-lg font-medium">Đang tải trailer...</p>
                  </div>
                </div>
              )}

              {/* Custom Controls Overlay */}
              {isReady && (
                <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 transition-all duration-300 ${
                  showControls ? 'opacity-100' : 'opacity-0'
                }`}>
                  {/* Top Bar */}
                  <div className="absolute top-0 left-0 right-0 p-6">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold">{currentTrailer.title}</h3>
                        <span className="px-3 py-1 bg-red-500 rounded-full text-sm font-medium">HD</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>2:30</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>1.2M</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Center Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={togglePlayPause}
                      className="group/play bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-8 rounded-full transition-all duration-300 hover:scale-110 border border-white/20"
                    >
                      {isPlaying ? (
                        <Pause className="w-12 h-12" />
                      ) : (
                        <Play className="w-12 h-12 ml-1" />
                      )}
                    </button>
                  </div>

                  {/* Bottom Controls */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center justify-between text-white">
                      {/* Left Controls */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={prevTrailer}
                          className="p-3 hover:bg-white/10 rounded-full transition-colors"
                        >
                          <SkipBack className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextTrailer}
                          className="p-3 hover:bg-white/10 rounded-full transition-colors"
                        >
                          <SkipForward className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Right Controls */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={toggleMute}
                          className="p-3 hover:bg-white/10 rounded-full transition-colors"
                        >
                          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                        <button className="p-3 hover:bg-white/10 rounded-full transition-colors">
                          <Maximize className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Playlist */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Danh sách trailer</h2>
          <div className="text-gray-400">
            {currentIndex + 1} / {trailers.length}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trailers.map((trailer, index) => (
            <div
              key={trailer.id}
              className={`group cursor-pointer transition-all duration-300 ${
                currentTrailer.id === trailer.id 
                  ? 'ring-4 ring-red-500 scale-105' 
                  : 'hover:scale-105 hover:ring-2 hover:ring-white/30'
              }`}
              onClick={() => changeTrailer(trailer, index)}
            >
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl">
                <div className="aspect-video relative">
                  <img 
                    src={trailer.thumbnail} 
                    alt={trailer.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-red-500 p-3 rounded-full">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Current Playing Indicator */}
                  {currentTrailer.id === trailer.id && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Đang phát
                    </div>
                  )}
                </div>

                {/* Movie Info */}
                <div className="p-4">
                  <h3 className="text-white font-bold text-lg mb-2 line-clamp-1">
                    {trailer.title}
                  </h3>
                  <div className="flex items-center gap-4 text-gray-400 text-sm">
                    <span>HD Quality</span>
                    <span>•</span>
                    <span>2024</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrailerSection;