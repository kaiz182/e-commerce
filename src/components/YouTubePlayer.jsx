import React from 'react'
import YouTube from 'react-youtube'
import { Play, Pause, Volume2, VolumeX, AlertCircle } from 'lucide-react'

const YouTubePlayer = ({ 
  videoId, 
  title,
  description,
  useYouTubePlayer 
}) => {
  const {
    isPlaying,
    isMuted,
    isReady,
    error,
    playerOptions,
    onReady,
    onStateChange,
    onError,
    togglePlayPause,
    toggleMute
  } = useYouTubePlayer

  return (
    <div className='relative bg-black rounded-xl overflow-hidden shadow-2xl group'>
      
      {/* YouTube Player */}
      <div className='aspect-video'>
        <YouTube
          videoId={videoId}
          opts={playerOptions}
          onReady={onReady}
          onStateChange={onStateChange}
          onError={onError}
          className='w-full h-full'
        />
      </div>

      {/* Controls Overlay */}
      {isReady && !error && (
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
          
          {/* Center Play Button */}
          <div className='absolute inset-0 flex items-center justify-center'>
            <button
              onClick={togglePlayPause}
              className='bg-red-600/90 hover:bg-red-500 text-white p-4 rounded-full backdrop-blur transition-all duration-200 hover:scale-110 shadow-lg'
            >
              {isPlaying ? (
                <Pause className='w-8 h-8 fill-current' />
              ) : (
                <Play className='w-8 h-8 fill-current ml-1' />
              )}
            </button>
          </div>

          {/* Bottom Info & Controls */}
          <div className='absolute bottom-0 left-0 right-0 p-4'>
            <div className='flex items-end justify-between'>
              
              {/* Video Info */}
              <div className='flex-1 mr-4'>
                <h3 className='text-white font-bold text-lg mb-1'>{title}</h3>
                <p className='text-gray-300 text-sm line-clamp-2'>{description}</p>
              </div>

              {/* Volume Button */}
              <button
                onClick={toggleMute}
                className='bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur transition-all'
              >
                {isMuted ? <VolumeX className='w-4 h-4' /> : <Volume2 className='w-4 h-4' />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {!isReady && !error && (
        <div className='absolute inset-0 flex items-center justify-center bg-gray-900/90'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent mx-auto mb-3'></div>
            <p className='text-white font-medium'>Đang tải...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className='absolute inset-0 flex items-center justify-center bg-gray-900/90'>
          <div className='text-center text-red-400'>
            <AlertCircle className='w-12 h-12 mx-auto mb-3' />
            <p className='font-medium'>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className='mt-3 px-4 py-2 bg-red-600 text-white rounded-full text-sm hover:bg-red-700 transition'
            >
              Thử lại
            </button>
          </div>
        </div>
      )}

      {/* Quality Badge */}
      <div className='absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold'>
        HD
      </div>
    </div>
  )
}

export default YouTubePlayer