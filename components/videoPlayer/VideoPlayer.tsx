import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import styles from './videoPlayer.module.css';

interface VideoPlayerProps {
  videoSrc: string | undefined;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoSrc }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [player, setPlayer] = useState<any>(null);

  // Create a new Intersection Observer when the component mounts
  useEffect(() => {
    let observer: IntersectionObserver;

    if (videoRef.current) {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5,
      };

      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          // If the video is in viewport
          if (entry.isIntersecting) {
            if (player) player.play();
          } else {
            if (player) player.pause();
          }
        });
      }, options);

      observer.observe(videoRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, [player]);

  useEffect(() => {
    if (videoRef.current) {
      setPlayer(
        videojs(videoRef.current, {
          controls: true,
          autoplay: 'any',
          sources: [
            {
              src: videoSrc,
              type: 'application/x-mpegURL',
            },
          ],
        }),
      );
    }

    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, [videoSrc]);

  return (
    <div>
      <div data-vjs-player className="flex items-center">
        <video ref={videoRef} className={`video-js`} />
      </div>
    </div>
  );
};

export default VideoPlayer;
