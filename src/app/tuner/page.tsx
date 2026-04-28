'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Tuner from '@/components/Tuner';
import { PitchDetector } from '@/utils/pitchDetector';

// 吉他六弦的目标音高 (EADGBE)
const GUITAR_STRINGS = [
  { note: 'E', octave: 2, frequency: 82.41, label: '6弦 (E2)' },
  { note: 'A', octave: 2, frequency: 110.0, label: '5弦 (A2)' },
  { note: 'D', octave: 3, frequency: 146.83, label: '4弦 (D3)' },
  { note: 'G', octave: 3, frequency: 196.0, label: '3弦 (G3)' },
  { note: 'B', octave: 3, frequency: 246.94, label: '2弦 (B3)' },
  { note: 'E', octave: 4, frequency: 329.63, label: '1弦 (E4)' },
];

// 音名数组
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export default function TunerPage() {
  const [isListening, setIsListening] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [currentFrequency, setCurrentFrequency] = useState<number | null>(null);
  const [currentNote, setCurrentNote] = useState<string | null>(null);
  const [currentOctave, setCurrentOctave] = useState<number | null>(null);
  const [deviation, setDeviation] = useState<number>(0);
  const [isInTune, setIsInTune] = useState(false);
  const [targetNote, setTargetNote] = useState<typeof GUITAR_STRINGS[0] | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const pitchDetectorRef = useRef<PitchDetector | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // 频率转音名
  const frequencyToNote = useCallback((frequency: number): { note: string; octave: number; deviation: number } => {
    // A4 = 440Hz
    const a4 = 440;
    const a4Index = 9; // A 在 NOTE_NAMES 中的索引

    // 计算半音数
    const semitones = 12 * Math.log2(frequency / a4);
    const nearestSemitone = Math.round(semitones);
    const deviation = semitones - nearestSemitone;

    // 计算音名和八度
    const noteIndex = (a4Index + nearestSemitone) % 12;
    const octave = 4 + Math.floor((a4Index + nearestSemitone) / 12);

    // 处理负数索引
    const adjustedNoteIndex = noteIndex < 0 ? noteIndex + 12 : noteIndex;
    const adjustedOctave = noteIndex < 0 ? octave - 1 : octave;

    return {
      note: NOTE_NAMES[adjustedNoteIndex],
      octave: adjustedOctave,
      deviation: deviation * 100, // 转换为音分
    };
  }, []);

  // 启动麦克风
  const startListening = useCallback(async () => {
    try {
      setShowPermissionModal(true);

      // 请求麦克风权限
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false,
        },
      });

      streamRef.current = stream;
      setHasPermission(true);
      setShowPermissionModal(false);

      // 创建音频上下文
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;

      // 如果音频上下文已暂停，恢复它
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // 创建分析器节点
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      // 创建媒体流源
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      // 创建音高检测器
      pitchDetectorRef.current = new PitchDetector(audioContext.sampleRate, analyser.fftSize);

      setIsListening(true);

      // 开始分析音频
      const analyze = () => {
        if (!analyserRef.current || !pitchDetectorRef.current) return;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Float32Array(bufferLength);
        analyserRef.current.getFloatTimeDomainData(dataArray);

        // 检测音高
        const frequency = pitchDetectorRef.current.detectPitch(dataArray);

        if (frequency && frequency > 0) {
          setCurrentFrequency(frequency);

          // 如果有目标音高，使用目标音高计算偏差
          if (targetNote) {
            const semitones = 12 * Math.log2(frequency / targetNote.frequency);
            const deviation = semitones * 100; // 转换为音分

            setDeviation(deviation);
            setIsInTune(Math.abs(deviation) < 5);
            setCurrentNote(targetNote.note);
            setCurrentOctave(targetNote.octave);
          } else {
            // 否则自动识别音高
            const noteInfo = frequencyToNote(frequency);
            setCurrentNote(noteInfo.note);
            setCurrentOctave(noteInfo.octave);
            setDeviation(noteInfo.deviation);
            setIsInTune(Math.abs(noteInfo.deviation) < 5);
          }
        } else {
          setCurrentFrequency(null);
          setCurrentNote(null);
          setCurrentOctave(null);
          setDeviation(0);
          setIsInTune(false);
        }

        animationFrameRef.current = requestAnimationFrame(analyze);
      };

      analyze();
    } catch (error) {
      console.error('无法获取麦克风权限:', error);
      setHasPermission(false);
      setShowPermissionModal(false);
    }
  }, [frequencyToNote, targetNote]);

  // 停止监听
  const stopListening = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setIsListening(false);
    setCurrentFrequency(null);
    setCurrentNote(null);
    setCurrentOctave(null);
    setDeviation(0);
    setIsInTune(false);
  }, []);

  // 选择目标音高
  const selectTargetNote = (stringNote: typeof GUITAR_STRINGS[0]) => {
    setTargetNote(targetNote?.label === stringNote.label ? null : stringNote);
  };

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center text-primary hover:text-primary/80 mb-6 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            返回首页
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-dark mb-4">
            吉他调音器
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            使用我们的免费在线调音器，精准调整您的吉他音高。点击开始按钮，允许麦克风权限，即可开始调音。
          </p>
        </div>

        {/* Tuner Component */}
        <Tuner
          isListening={isListening}
          hasPermission={hasPermission}
          currentFrequency={currentFrequency}
          currentNote={currentNote}
          currentOctave={currentOctave}
          deviation={deviation}
          isInTune={isInTune}
          targetNote={targetNote}
          startListening={startListening}
          stopListening={stopListening}
          selectTargetNote={selectTargetNote}
          guitarStrings={GUITAR_STRINGS}
          showPermissionModal={showPermissionModal}
          setShowPermissionModal={setShowPermissionModal}
        />

        {/* Tips */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-xl font-bold text-dark mb-4">调音技巧</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-primary/10 text-primary rounded-full text-sm font-medium mr-3 flex-shrink-0">1</span>
              <span>拨弹琴弦后，等待声音稳定，观察指针的位置。</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-primary/10 text-primary rounded-full text-sm font-medium mr-3 flex-shrink-0">2</span>
              <span>指针指向左侧红色区域表示音高偏低，需要拧紧琴弦。</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-primary/10 text-primary rounded-full text-sm font-medium mr-3 flex-shrink-0">3</span>
              <span>指针指向右侧红色区域表示音高偏高，需要放松琴弦。</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-primary/10 text-primary rounded-full text-sm font-medium mr-3 flex-shrink-0">4</span>
              <span>当指针指向中间绿色区域时，表示音高准确。</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-primary/10 text-primary rounded-full text-sm font-medium mr-3 flex-shrink-0">5</span>
              <span>点击下方的弦位按钮可以锁定目标音高，方便针对性调音。</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}