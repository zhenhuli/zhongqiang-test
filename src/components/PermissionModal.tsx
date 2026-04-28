'use client';

import { useEffect } from 'react';

interface PermissionModalProps {
  onClose: () => void;
}

export default function PermissionModal({ onClose }: PermissionModalProps) {
  // 禁止背景滚动
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Icon */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-4">
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
            麦克风权限请求
          </h3>
          <p className="text-gray-600">
            为了能够检测您乐器的音高，我们需要访问您的麦克风。
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
          <h4 className="font-semibold text-dark mb-3">如何允许麦克风权限：</h4>
          <ol className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-primary/10 text-primary rounded-full text-sm font-medium mr-3 flex-shrink-0">1</span>
              <span>在浏览器弹出的权限提示中，点击"允许"按钮</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-primary/10 text-primary rounded-full text-sm font-medium mr-3 flex-shrink-0">2</span>
              <span>权限允许后，调音器将开始监听您的乐器声音</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-primary/10 text-primary rounded-full text-sm font-medium mr-3 flex-shrink-0">3</span>
              <span>如果没有看到权限提示，请检查浏览器地址栏左侧的权限设置</span>
            </li>
          </ol>
        </div>

        {/* Privacy Note */}
        <div className="flex items-start p-4 bg-blue-50 rounded-xl mb-6">
          <svg
            className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">隐私保护</p>
            <p className="text-blue-700">
              您的音频数据仅在本地处理，不会上传到任何服务器。我们完全尊重您的隐私。
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            稍后再说
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
          >
            我知道了
          </button>
        </div>
      </div>
    </div>
  );
}