import Link from 'next/link';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Instruments from '@/components/Instruments';
import HowItWorks from '@/components/HowItWorks';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              功能亮点
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              GuitarTuner 提供了一系列强大的功能，让您的调音体验更加便捷和精准。
            </p>
          </div>
          <Features />
        </div>
      </section>

      {/* Instruments Section */}
      <section id="instruments" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              支持的乐器
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              GuitarTuner 不仅支持吉他调音，还适用于多种常见的弦乐器。
            </p>
          </div>
          <Instruments />
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              使用步骤
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              使用 GuitarTuner 调音非常简单，只需几个简单的步骤即可完成。
            </p>
          </div>
          <HowItWorks />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            准备好开始调音了吗？
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            无需下载，无需安装，只需点击下方按钮，即可开始使用我们的免费在线调音器。
          </p>
          <Link
            href="/tuner"
            className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-primary bg-white hover:bg-gray-100 transition-colors shadow-lg"
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
        </div>
      </section>
    </div>
  );
}