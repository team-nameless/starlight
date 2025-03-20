import { useCallback, useEffect, useState, useRef } from 'react';
import '../assets/stylesheets/SpotifyEmbed.css';
import SpotifyService from '../services/SpotifyService';

interface SpotifyPlayerProps {
  trackUrl: string;
  onPlaybackChange?: (isPlaying: boolean) => void;
  onError?: (message: string) => void;
  duration?: number;
}

const SpotifyPlayer = ({ trackUrl, onPlaybackChange, onError, duration }: SpotifyPlayerProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [trackId, setTrackId] = useState<string | null>(null);
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const spotifyWindowRef = useRef<Window | null>(null);

  // Extract track ID from various formats
  useEffect(() => {
    if (trackUrl) {
      try {
        let id = null;
        
        if (trackUrl.includes('spotify:track:')) {
          id = trackUrl.split('spotify:track:')[1].split(/[?&#]/)[0];
        } else if (trackUrl.includes('open.spotify.com/track/')) {
          id = trackUrl.split('/track/')[1].split(/[?&#]/)[0];
        } else if (/^[0-9A-Za-z]{22}$/.test(trackUrl)) {
          id = trackUrl;
        }
        
        setTrackId(id);
        console.log('Extracted track ID:', id);
      } catch (e) {
        console.error('Error extracting track ID:', e);
        setTrackId(null);
      }
    } else {
      setTrackId(null);
    }
  }, [trackUrl]);

  // Check Spotify premium status
  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (SpotifyService.isAuthenticated()) {
        try {
          const isPremium = await SpotifyService.checkPremiumStatus();
          setIsPremiumUser(isPremium);
        } catch (error) {
          console.error('Error checking premium status:', error);
          setIsPremiumUser(false);
        }
      }
    };

    checkPremiumStatus();
  }, []);

  // Clean up timers when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Format remaining time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Start auto-close timer
  const startDurationTimer = useCallback(() => {
    // Clear any existing timers first
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Only set up the timer if we have a valid duration
    if (duration && duration > 0) {
      console.log(`Setting up auto-close timer for ${duration} seconds`);
      
      // Set up the timer to track remaining time
      const durationMs = duration * 1000;
      const endTime = Date.now() + durationMs;
      
      // Function to update the remaining time display
      const updateRemainingTime = () => {
        const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
        setRemainingTime(remaining);
        return remaining;
      };
      
      // Initial update
      updateRemainingTime();
      
      // Set interval to update the countdown display
      intervalRef.current = setInterval(() => {
        const remaining = updateRemainingTime();
        if (remaining <= 0 && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }, 1000);
      
      // Set the main timer to close the modal when duration expires
      timerRef.current = setTimeout(() => {
        console.log(`Duration timer expired after ${duration} seconds, closing modal`);
        
        // Close the Spotify modal
        setIsModalOpen(false);
        
        // Notify parent component
        onPlaybackChange?.(false);
        
        // Close any Spotify window that might have been opened
        if (spotifyWindowRef.current) {
          try {
            spotifyWindowRef.current.close();
          } catch (e) {
            console.log('Could not close Spotify window:', e);
          }
          spotifyWindowRef.current = null;
        }
        
        // Clear the remaining time display
        setRemainingTime(null);
        
        // Clear interval if it's still running
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }, durationMs);
      
      return true;
    }
    
    return false;
  }, [duration, onPlaybackChange]);

  // Open Spotify embed modal
  const openSpotifyModal = useCallback(() => {
    if (!trackId) {
      onError?.('No valid track ID found');
      return;
    }
    
    setIsLoading(true);
    setIsModalOpen(true);
    
    // Notify parent that playback is "on"
    onPlaybackChange?.(true);
    
    // Start the auto-close timer based on song duration
    startDurationTimer();
    
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, [trackId, onError, onPlaybackChange, startDurationTimer]);

  // Close Spotify embed modal
  const closeSpotifyModal = useCallback(() => {
    setIsModalOpen(false);
    onPlaybackChange?.(false);
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setRemainingTime(null);
    
    if (spotifyWindowRef.current) {
      try {
        spotifyWindowRef.current.close();
      } catch (e) {
        console.log('Could not close Spotify window:', e);
      }
      spotifyWindowRef.current = null;
    }
  }, [onPlaybackChange]);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isModalOpen) {
        closeSpotifyModal();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeSpotifyModal]);

  // Open in native Spotify app
  const openInSpotifyApp = useCallback(() => {
    if (!trackId) return;
    
    // Use the spotify: protocol to attempt to open the native app
    const spotifyUri = `spotify:track:${trackId}`;
    
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = spotifyUri;
    
    document.body.appendChild(iframe);
    
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 1000);
    
    setTimeout(() => {
      if (isModalOpen) {
        console.log('Falling back to web player');
        spotifyWindowRef.current = window.open(`https://open.spotify.com/track/${trackId}`, '_blank');
      }
    }, 1500);
  }, [trackId, isModalOpen]);

  // Connect to Spotify
  const connectToSpotify = useCallback(() => {
    SpotifyService.authenticate();
  }, []);

  return (
    <>
      <div className="play-card-button-container">
        <button 
          className="play-card-button" 
          onClick={openSpotifyModal}
          disabled={isLoading || !trackId}
          aria-label="Open Spotify Player"
          title={duration ? `Play (${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')})` : "Play on Spotify"}
        >
          <div className="play-card-icon-container">
            <span className="play-card-icon">
              {isLoading ? "⌛" : "▶"}
            </span>
          </div>
        </button>
      </div>

      {isModalOpen && trackId && (
        <div className="spotify-modal-overlay" onClick={closeSpotifyModal}>
          <div className="spotify-modal-content" onClick={e => e.stopPropagation()}>
            <button className="spotify-modal-close" onClick={closeSpotifyModal}>×</button>
            
            <iframe 
              src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0&autoplay=1`}
              width="100%" 
              height="100%" 
              frameBorder="0" 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
              title="Spotify Player"
            />
            
            <div className="spotify-modal-controls">
              {!SpotifyService.isAuthenticated() && (
                <button className="spotify-connect-btn" onClick={connectToSpotify}>
                  Connect Spotify for Full Songs
                </button>
              )}
              
              <button className="spotify-open-btn" onClick={openInSpotifyApp}>
                Open in Spotify App
              </button>
              
              {remainingTime !== null && (
                <div className="spotify-timer-notice">
                  Auto-closing in {formatTime(remainingTime)}
                </div>
              )}
              
              {SpotifyService.isAuthenticated() && !isPremiumUser && (
                <div className="spotify-premium-notice">
                  Spotify Premium is required for full song playback
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SpotifyPlayer;
