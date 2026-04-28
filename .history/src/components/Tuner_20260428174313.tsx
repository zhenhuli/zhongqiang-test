'use client';

import { useEffect, useRef } from 'react';
import PermissionModal from './PermissionModal';

interface GuitarString {
  note: string;
  octave: number;
  frequency: number;
  label: string;
}

interface TunerProps {
  isListening: boolean;
  hasPermission: boolean | null;
  currentFrequency: number | null;
  currentNote: string | null;
  currentOctave: number | null;
  deviation: number;
  isInTune: boolean;
  targetNote: GuitarString | null;
  startListening: () => void;
  stopListening: () => void;
  selectTargetNote: (stringNote: GuitarString) => void;
  guitarStrings: GuitarString[];
  showPermissionModal: boolean;
  setShowPermissionModal: (show: boolean) => void;
}

export default function Tuner({
  isListening,
  hasPermission,
  currentFrequency,
  currentNote,
  currentOctave,
  deviation,
  isInTune,
  targetNote,
  startListening,
  stopListening,
  selectTargetNote,
  guitarStrings,
  showPermissionModal,
  setShowPermissionModal,
}: TunerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 绘制调音器表盘
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 40;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制外圈背景
    const outerGradient = ctx.createRadialGradient(
      centerX,
      centerY,
      radius - 20,
      centerX,
      centerY,
      radius + 20
    );
    outerGradient.addColorStop(0, '#f9fafb');
    outerGradient.addColorStop(1, '#e5e7eb');

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 10, 0, 2 * Math.PI);
    ctx.fillStyle = outerGradient;
    ctx.fill();
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 绘制内圈
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 绘制刻度
    const drawScale = () => {
      // 主刻度 -50 到 +50 音分
      for (let cents = -50; cents <= 50; cents += 5) {
        // 计算角度：-50音分 = -45度，+50音分 = +45度
        const angle = (cents / 50) * (Math.PI / 4);
        // 刻度线从内向外画，startRadius 是内半径，endRadius 是外半径
        const innerRadius = radius - 35;
        const outerRadius = radius - 15;
        const tickLength = cents % 10 === 0 ? 20 : 12;
        
        const x1 = centerX + (outerRadius - tickLength) * Math.sin(angle);
        const y1 = centerY - (outerRadius - tickLength) * Math.cos(angle);
        const x2 = centerX + outerRadius * Math.sin(angle);
        const y2 = centerY - outerRadius * Math.cos(angle);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = cents % 10 === 0 ? 2 : 1;
        ctx.strokeStyle = cents === 0 ? '#10b981' : '#6b7280';
        ctx.stroke();

        // 绘制标签 - 放在刻度线内侧，避免重叠
        if (cents % 10 === 0 && cents !== 0) {
          // 标签位置：刻度线内侧，稍微远离刻度线
          const labelRadius = outerRadius - tickLength - 15;
          const labelX = centerX + labelRadius * Math.sin(angle);
          const labelY = centerY - labelRadius * Math.cos(angle);
          
          ctx.save();
          ctx.translate(labelX, labelY);
          // 标签保持水平，不跟随角度旋转，更易读
          ctx.font = 'bold 11px Arial';
          ctx.fillStyle = '#374151';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(cents.toString(), 0, 0);
          ctx.restore();
        }
      }
    };

    drawScale();

    // 绘制绿色区域（准确范围 ±5 音分）
    const drawGreenZone = () => {
      const startAngle = -Math.PI / 4;
      const endAngle = Math.PI / 4;

      // 中心绿色区域
      const centerStartAngle = (-5 / 50) * (Math.PI / 4);
      const centerEndAngle = (5 / 50) * (Math.PI / 4);

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 15, centerStartAngle - Math.PI / 2, centerEndAngle - Math.PI / 2);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
      ctx.lineWidth = 30;
      ctx.stroke();
    };

    drawGreenZone();

    // 绘制指针
    if (isListening && currentFrequency !== null) {
      // 计算指针角度
      const clampedDeviation = Math.max(-50, Math.min(50, deviation));
      const pointerAngle = (clampedDeviation / 50) * (Math.PI / 4);

      // 指针颜色
      const pointerColor = isInTune ? '#10b981' : '#ef4444';

      // 绘制指针阴影
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(pointerAngle);
      ctx.beginPath();
      ctx.moveTo(-4, 20);
      ctx.lineTo(-2, -radius + 40);
      ctx.lineTo(2, -radius + 40);
      ctx.lineTo(4, 20);
      ctx.closePath();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fill();
      ctx.restore();

      // 绘制指针
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(pointerAngle);
      ctx.beginPath();
      ctx.moveTo(-3, 20);
      ctx.lineTo(-1.5, -radius + 40);
      ctx.lineTo(1.5, -radius + 40);
      ctx.lineTo(3, 20);
      ctx.closePath();
      ctx.fillStyle = pointerColor;
      ctx.fill();
      ctx.strokeStyle = pointerColor === '#10b981' ? '#059669' : '#dc2626';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // 绘制中心点
      ctx.beginPath();
      ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
      ctx.fillStyle = pointerColor;
      ctx.fill();
      ctx.strokeStyle = pointerColor === '#10b981' ? '#059669' : '#dc2626';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 内圈
      ctx.beginPath();
      ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    } else {
      // 绘制静止状态的中心点
      ctx.beginPath();
      ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
      ctx.fillStyle = '#3b82f6';
      ctx.fill();
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 内圈
      ctx.beginPath();
      ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // 绘制静止指针
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.beginPath();
      ctx.moveTo(-3, 20);
      ctx.lineTo(-1.5, -radius + 40);
      ctx.lineTo(1.5, -radius + 40);
      ctx.lineTo(3, 20);
      ctx.closePath();
      ctx.fillStyle = '#3b82f6';
      ctx.fill();
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }

    // 绘制装饰性刻度
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * 2 * Math.PI - Math.PI / 2;
      const isMajor = i % 10 === 0;
      const isQuarter = i % 15 === 0;

      const startRadius = radius + 15;
      const endRadius = radius + 25;

      const x1 = centerX + startRadius * Math.cos(angle);
      const y1 = centerY + startRadius * Math.sin(angle);
      const x2 = centerX + endRadius * Math.cos(angle);
      const y2 = centerY + endRadius * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineWidth = isQuarter ? 3 : isMajor ? 2 : 1;
      ctx.strokeStyle = isQuarter ? '#3b82f6' : isMajor ? '#6b7280' : '#d1d5db';
      ctx.stroke();
    }
  }, [isListening, currentFrequency, deviation, isInTune]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Permission Modal */}
      {showPermissionModal && (
        <PermissionModal
          onClose={() => setShowPermissionModal(false)}
        />
      )}

      {/* Tuner Display */}
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
        {/* Note Display */}
        <div className="text-center mb-8">
          {isListening ? (
            <>
              <div className="flex items-center justify-center mb-4">
                <div
                  className={`w-4 h-4 rounded-full mr-2 ${
                    currentFrequency ? 'bg-secondary animate-pulse' : 'bg-gray-300'
                  }`}
                ></div>
                <span className="text-gray-600 text-sm">
                  {currentFrequency ? '正在监听...' : '等待音频输入...'}
                </span>
              </div>

              {currentNote && (
                <div className="flex flex-col items-center">
                  <div className="flex items-end justify-center mb-2">
                    <span
                      className={`text-7xl md:text-9xl font-bold ${
                        isInTune ? 'text-secondary' : 'text-danger'
                      }`}
                    >
                      {currentNote}
                    </span>
                    {currentOctave !== null && (
                      <span className="text-2xl md:text-3xl text-gray-500 mb-3">
                        {currentOctave}
                      </span>
                    )}
                  </div>

                  {currentFrequency && (
                    <div className="text-xl text-gray-600 mb-2">
                      {currentFrequency.toFixed(1)} Hz
                    </div>
                  )}

                  <div
                    className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-medium ${
                      isInTune
                        ? 'bg-secondary/10 text-secondary'
                        : 'bg-danger/10 text-danger'
                    }`}
                  >
                    {isInTune ? (
                      <>
                        <svg
                          className="w-6 h-6 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        音准正确
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-6 h-6 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {deviation > 0
                          ? `偏高 ${Math.abs(deviation).toFixed(1)} 音分`
                          : `偏低 ${Math.abs(deviation).toFixed(1)} 音分`}
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-10 h-10 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-dark mb-2">
                准备开始调音
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                点击下方按钮，允许麦克风权限，即可开始使用我们的精准调音器。
              </p>
            </div>
          )}
        </div>

        {/* Canvas Dial */}
        <div className="flex justify-center mb-8">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="w-full max-w-sm md:max-w-md"
          />
        </div>

        {/* Control Button */}
        <div className="flex justify-center">
          {!isListening ? (
            <button
              onClick={startListening}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-medium text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <svg
                className="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
              开始调音
            </button>
          ) : (
            <button
              onClick={stopListening}
              className="inline-flex items-center px-8 py-4 bg-danger text-white rounded-full font-medium text-lg hover:bg-danger/90 transition-colors"
            >
              <svg
                className="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                />
              </svg>
              停止监听
            </button>
          )}
        </div>

        {/* Permission Status */}
        {hasPermission === false && (
          <div className="mt-6 p-4 bg-danger/10 border border-danger/20 rounded-xl text-center">
            <p className="text-danger">
              无法获取麦克风权限。请在浏览器设置中允许访问麦克风，然后刷新页面重试。
            </p>
          </div>
        )}
      </div>

      {/* String Shortcuts */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h3 className="text-xl font-bold text-dark mb-6 text-center">
          吉他六弦快捷键
        </h3>
        <p className="text-gray-600 text-center mb-6">
          点击下方按钮锁定目标音高，方便针对性调音
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {guitarStrings.map((stringNote, index) => (
            <button
              key={index}
              onClick={() => selectTargetNote(stringNote)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 ${
                targetNote?.label === stringNote.label
                  ? 'bg-primary text-white shadow-lg scale-105'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span
                className={`text-2xl font-bold ${
                  targetNote?.label === stringNote.label
                    ? 'text-white'
                    : 'text-primary'
                }`}
              >
                {stringNote.note}
              </span>
              <span
                className={`text-xs mt-1 ${
                  targetNote?.label === stringNote.label
                    ? 'text-white/80'
                    : 'text-gray-500'
                }`}
              >
                {stringNote.label.split(' ')[0]}
              </span>
              <span
                className={`text-xs ${
                  targetNote?.label === stringNote.label
                    ? 'text-white/70'
                    : 'text-gray-400'
                }`}
              >
                {stringNote.frequency.toFixed(0)}Hz
              </span>
            </button>
          ))}
        </div>

        {targetNote && (
          <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl text-center">
            <p className="text-primary">
              已锁定目标音高：<span className="font-bold">{targetNote.label}</span> ({targetNote.frequency.toFixed(2)}Hz)
              <button
                onClick={() => selectTargetNote(targetNote)}
                className="ml-3 text-sm underline hover:no-underline"
              >
                取消锁定
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
