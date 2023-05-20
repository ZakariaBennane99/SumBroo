/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';



const formatTime = (time) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time - (hours * 3600)) / 60);
  const seconds = Math.floor(time % 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};


const AudioVisualizer = ({ audioSrc, filename }) => {

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);

  useEffect(() => {
    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#73739a',
      progressColor: '#1465e7',
      barWidth: 3,
      barRadius: 3,
      cursorWidth: 0,
      barHeight: 1.2,
      fillParent: true,
      barGap: 2,
      responsive: true,
      audioRate: 1.05
    });

    wavesurferRef.current.load(audioSrc);

    wavesurferRef.current.on('audioprocess', () => {
      setCurrentTime(wavesurferRef.current.getCurrentTime());
    });

    wavesurferRef.current.on('finish', () => {
      setIsFinished(true);
    });

    return () => {
      wavesurferRef.current.destroy();
    };
  }, [audioSrc]);

  // handle play
  const handlePlay = () => {
    if (isPlaying) {
      wavesurferRef.current.pause();
    } else {
      wavesurferRef.current.play();
      setIsFinished(false);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div id='audioContainer'>
      <div>
        <div>
          <button id='playPauseBtn' onClick={handlePlay}>
            <img src={
                isFinished ? './play.svg' : // Show stop icon if audio has finished
                isPlaying ? './pause.svg' :
                './play.svg'
              }
              alt='play-pause-stop button'/>
          </button>
          <span id='audioTracker'>{formatTime(currentTime)}</span>
        </div>
        <a id='downloadBtn' href={audioSrc} download={filename + '.wav'}>
          <img src='./download.svg' alt='download-button'/>
        </a>
      </div>
      <div id='waveContainer' ref={waveformRef} />
    </div>
  )
};

export default AudioVisualizer;
