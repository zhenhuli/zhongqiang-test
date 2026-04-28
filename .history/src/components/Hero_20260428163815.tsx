'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div
            className={`text-center lg:text-left transition-all duration-1000 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              完全免费
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark mb-6 leading-tight">
              免费在线{' '}
              <span className="text-gradient">吉他调音器</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
              使用原生 Web Audio API 技术，为您提供精准的调音体验。无需下载，无需安装，打开浏览器即可使用。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/tuner"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg"
              >
                开始调音
                <svg
                  className="ml-2 -mr-1 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary/10 transition-colors"
              >
                了解更多
              </Link>
            </div>

            {/* Features Badges */}
            <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-4">
              <div className="flex items-center text-gray-600 text-sm">
                <svg
                  className="w-5 h-5 mr-2 text-secondary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                精准调音
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <svg
                  className="w-5 h-5 mr-2 text-secondary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                移动端适配
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <svg
                  className="w-5 h-5 mr-2 text-secondary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                无需安装
              </div>
            </div>
          </div>

          {/* Visual Content */}
          <div
            className={`relative transition-all duration-1000 transform ${
              isVisible
                ? 'translate-y-0 opacity-100 delay-300'
                : 'translate-y-10 opacity-0'
            }`}
          >
            <div className="relative mx-auto w-72 h-72 md:w-96 md:h-96">
              {/* Background Circle */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full animate-pulse"></div>
              
              {/* Tuner Visualization */}
              <div className="absolute inset-4 bg-white rounded-full shadow-2xl flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Outer Ring */}
                  <div className="absolute inset-4 border-8 border-gray-100 rounded-full"></div>
                  
                  {/* Needle */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-32 bg-gradient-to-b from-primary to-secondary rounded-full origin-bottom" style={{ transform: 'translate(-50%, -100%) rotate(-10deg)', transformOrigin: '50% 100%' }}></div>
                  
                  {/* Center Dot */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg"></div>
                  
                  {/* Green Zone */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full w-4 h-16 bg-green-400/30 rounded-t-full" style={{ transform: 'translate(-50%, -100%)' }}></div>
                  
                  {/* Markers */}
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-1/2 left-1/2 w-1 h-4 bg-gray-300 rounded-full"
                      style={{
                        transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-120px)`,
                        height: i % 3 === 0 ? '16px' : '12px',
                        width: i % 3 === 0 ? '3px' : '1px',
                        backgroundColor: i % 3 === 0 ? '#6b7280' : '#d1d5db',
                      }}
                    ></div>
                  ))}
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-2xl shadow-lg">
                <div className="text-2xl">🎸</div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl shadow-lg">
                <div className="text-2xl">🎵</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
