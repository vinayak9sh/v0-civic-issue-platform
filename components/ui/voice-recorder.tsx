"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Mic, Play, Pause, Square, Trash2, Download } from "lucide-react"

interface VoiceRecorderProps {
  onRecordingComplete?: (audioBlob: Blob) => void
  onRecordingDelete?: () => void
  maxDuration?: number // in seconds
  className?: string
}

export function VoiceRecorder({
  onRecordingComplete,
  onRecordingDelete,
  maxDuration = 300, // 5 minutes default
  className,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [playbackTime, setPlaybackTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [audioLevel, setAudioLevel] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current)
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      streamRef.current = stream

      // Set up audio analysis for visual feedback
      const audioContext = new AudioContext()
      const analyser = audioContext.createAnalyser()
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)
      analyser.fftSize = 256
      analyserRef.current = analyser

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      })
      mediaRecorderRef.current = mediaRecorder

      const chunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm;codecs=opus" })
        setAudioBlob(blob)
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        onRecordingComplete?.(blob)

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }

      mediaRecorder.start(100) // Collect data every 100ms
      setIsRecording(true)
      setIsPaused(false)
      setRecordingTime(0)

      // Start recording timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1
          if (newTime >= maxDuration) {
            stopRecording()
          }
          return newTime
        })
      }, 1000)

      // Start audio level monitoring
      monitorAudioLevel()
    } catch (error) {
      console.error("Error starting recording:", error)
    }
  }

  const monitorAudioLevel = () => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)

    const updateLevel = () => {
      if (!analyserRef.current || !isRecording) return

      analyserRef.current.getByteFrequencyData(dataArray)
      const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length
      setAudioLevel(Math.min(100, (average / 255) * 100))

      animationFrameRef.current = requestAnimationFrame(updateLevel)
    }

    updateLevel()
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
    }
  }

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.resume()
      setIsPaused(false)

      // Resume timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1
          if (newTime >= maxDuration) {
            stopRecording()
          }
          return newTime
        })
      }, 1000)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && (isRecording || isPaused)) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
      setAudioLevel(0)

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }

  const playRecording = () => {
    if (audioUrl && !isPlaying) {
      audioRef.current = new Audio(audioUrl)
      audioRef.current.play()
      setIsPlaying(true)
      setPlaybackTime(0)

      // Update playback time
      playbackIntervalRef.current = setInterval(() => {
        if (audioRef.current) {
          setPlaybackTime(audioRef.current.currentTime)
        }
      }, 100)

      audioRef.current.onended = () => {
        setIsPlaying(false)
        setPlaybackTime(0)
        if (playbackIntervalRef.current) {
          clearInterval(playbackIntervalRef.current)
        }
      }
    }
  }

  const pausePlayback = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current)
      }
    }
  }

  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioBlob(null)
    setAudioUrl(null)
    setRecordingTime(0)
    setPlaybackTime(0)
    setIsPlaying(false)
    onRecordingDelete?.()
  }

  const downloadRecording = () => {
    if (audioBlob && audioUrl) {
      const a = document.createElement("a")
      a.href = audioUrl
      a.download = `voice-note-${new Date().toISOString().slice(0, 19)}.webm`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getRecordingProgress = () => {
    return (recordingTime / maxDuration) * 100
  }

  const getPlaybackProgress = () => {
    if (!audioRef.current || !audioRef.current.duration) return 0
    return (playbackTime / audioRef.current.duration) * 100
  }

  return (
    <Card className={className}>
      <CardContent className="p-4 space-y-4">
        {/* Recording Controls */}
        <div className="flex items-center justify-center space-x-2">
          {!isRecording && !audioBlob && (
            <Button onClick={startRecording} className="bg-red-500 hover:bg-red-600">
              <Mic className="w-4 h-4 mr-2" />
              Start Recording
            </Button>
          )}

          {isRecording && !isPaused && (
            <>
              <Button onClick={pauseRecording} variant="outline">
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
              <Button onClick={stopRecording} variant="destructive">
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
            </>
          )}

          {isPaused && (
            <>
              <Button onClick={resumeRecording} className="bg-red-500 hover:bg-red-600">
                <Mic className="w-4 h-4 mr-2" />
                Resume
              </Button>
              <Button onClick={stopRecording} variant="destructive">
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
            </>
          )}
        </div>

        {/* Recording Status */}
        {(isRecording || isPaused) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant={isPaused ? "secondary" : "destructive"}>
                {isPaused ? <Pause className="w-3 h-3 mr-1" /> : <Mic className="w-3 h-3 mr-1" />}
                {isPaused ? "Paused" : "Recording"}
              </Badge>
              <span className="text-sm font-mono">{formatTime(recordingTime)}</span>
            </div>
            <Progress value={getRecordingProgress()} className="h-2" />
            {isRecording && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">Audio Level:</span>
                <Progress value={audioLevel} className="h-1 flex-1" />
              </div>
            )}
          </div>
        )}

        {/* Playback Controls */}
        {audioBlob && (
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <Button onClick={isPlaying ? pausePlayback : playRecording} variant="outline" size="sm">
                {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isPlaying ? "Pause" : "Play"}
              </Button>
              <Button onClick={deleteRecording} variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <Button onClick={downloadRecording} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>

            {isPlaying && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatTime(playbackTime)}</span>
                  <span>{formatTime(audioRef.current?.duration || recordingTime)}</span>
                </div>
                <Progress value={getPlaybackProgress()} className="h-2" />
              </div>
            )}

            <Badge variant="secondary" className="w-full justify-center">
              Voice note recorded ({formatTime(recordingTime)})
            </Badge>
          </div>
        )}

        {/* Instructions */}
        {!isRecording && !audioBlob && (
          <p className="text-xs text-muted-foreground text-center">
            Click "Start Recording" to add a voice description to your report. Maximum duration:{" "}
            {Math.floor(maxDuration / 60)} minutes.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
