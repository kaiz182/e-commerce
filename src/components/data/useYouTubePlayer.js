// src/hooks/useYouTubePlayer.js
import { useState, useCallback } from 'react';

export const useYouTubePlayer = () => {
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const onReady = useCallback((event) => {
    setPlayer(event.target);
    setIsReady(true);
  }, []);

  const onStateChange = useCallback((event) => {
    setIsPlaying(event.data === 1);
  }, []);

  const onError = useCallback((error) => {
    console.error('YouTube Player Error:', error);
  }, []);

  const togglePlayPause = () => {
    if (!player) return;
    isPlaying ? player.pauseVideo() : player.playVideo();
  };

  const toggleMute = () => {
    if (!player) return;
    isMuted ? player.unMute() : player.mute();
    setIsMuted(!isMuted);
  };

  return {
    player,
    isPlaying,
    isMuted,
    isReady,
    setIsReady,
    onReady,
    onStateChange,
    onError,
    togglePlayPause,
    toggleMute
  };
};
