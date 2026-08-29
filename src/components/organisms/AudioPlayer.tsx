import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ActionIcon,
  Box,
  Group,
  Paper,
  Slider,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  XIcon,
  PlayIcon,
  PauseIcon,
} from "@phosphor-icons/react";

import type { RootState } from '../../app/store';
import { closeAudioPlayer } from "../../features/audio/audioSlice";

export function AudioPlayer() {
  const dispatch = useDispatch();

  const url = useSelector(
    (state: RootState) => state.audio.url
  );

  const bandName = useSelector(
    (state: RootState) => state.audio.bandName
  );

  const trackTitle = useSelector(
    (state: RootState) => state.audio.trackTitle
  );


  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  /*
   * Is executed when URL in the Redux store changes
   */
  useEffect(() => {

    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    // Close player
    if (!url) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();

      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);

      return;
    }

    // Set new Audio source
    audio.src = url;
    audio.load();

    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);

    // Start automatically
    audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(() => {
        // Browsers may forbid autoplay
        setIsPlaying(false);
      });
  }, [url]);

  if (!url) {
    return null;
  }

  const handleTimeUpdate = (event: any) => {
    setCurrentTime(event.currentTarget.currentTime);
  };

  const handleLoadedMetadata = (event: any) => {
    setDuration(event.currentTarget.duration);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleEnded = (event: any) => {
    setIsPlaying(false);
    setCurrentTime(event.currentTarget.duration);
  };

  const togglePlay = () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  /*
   * Jumping in the audio file
   */
  const handleSeek = (value: number) => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.currentTime = value;
    setCurrentTime(value);
  };

  const handleClose = () => {
    const audio = audioRef.current;

    audio?.pause();

    dispatch(closeAudioPlayer());
  };

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) {
      return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Paper
      shadow="lg"
      withBorder
      radius={0}
      p="sm"
      pos="fixed"
      bottom={0}
      left={0}
      right={0}
      style={{
        zIndex: 1000,
      }}
    >
      <audio
        ref={audioRef}
        preload='metadata'
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
      />
      <Box ta='center' my='sm'>{bandName} - {trackTitle}</Box>
      <Group
        wrap="nowrap"
        gap="md"
        maw={1200}
        mx="auto"
        mb='sm'
      >
        {/* Play / Pause */}
        <Tooltip
          label={isPlaying ? "Pause" : "Abspielen"}
        >
          <ActionIcon
            size="lg"
            radius="xl"
            variant="filled"
            onClick={togglePlay}
            aria-label={
              isPlaying ? "Pause" : "Abspielen"
            }
          >
            {isPlaying ? (
              <PauseIcon size={20} />
            ) : (
              <PlayIcon size={20} />
            )}
          </ActionIcon>
        </Tooltip>

        {/* Current position */}
        <Text
          size="sm"
          ff="monospace"
          w={45}
          ta="right"
        >
          {formatTime(currentTime)}
        </Text>

        {/* Seek Slider */}
        <Box style={{ flex: 1 }}>
          <Slider
            value={currentTime}
            min={0}
            max={duration || 0}
            step={0.1}
            onChange={handleSeek}
            disabled={!duration}
            label={formatTime}
            thumbSize={16}
            aria-label="Position im Audiomaterial"
          />
        </Box>

        {/* Gesamtdauer */}
        <Text
          size="sm"
          ff="monospace"
          w={45}
        >
          {formatTime(duration)}
        </Text>

        {/* Schließen */}
        <Tooltip label="Schließen">
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={handleClose}
            aria-label="Audio-Player schließen"
          >
            <XIcon size={20} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Paper>
  );
}
