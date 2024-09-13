// app/Play/components/AudioControl.js
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from 'react';

export const AudioControl = ({ audioUrl }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const handleAudioPlayPause = (event) => {
        event.stopPropagation(); // Prevent click from triggering card flip
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="audio-container p-2 bg-white rounded-full shadow-md">
            <audio ref={audioRef} className="hidden">
                <source src={audioUrl} type="audio/mp3" />
                Your browser does not support the audio element.
            </audio>
            <FontAwesomeIcon
                icon={isPlaying ? faPause : faPlay}
                onClick={handleAudioPlayPause}
                className="audio-icon cursor-pointer"
            />
        </div>
    );
};
