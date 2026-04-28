export class PitchDetector {
  private sampleRate: number;
  private bufferLength: number;

  constructor(sampleRate: number, bufferLength: number) {
    this.sampleRate = sampleRate;
    this.bufferLength = bufferLength;
  }

  // 自相关算法检测音高
  detectPitch(buffer: Float32Array): number | null {
    // 检查信号能量
    let energy = 0;
    for (let i = 0; i < buffer.length; i++) {
      energy += buffer[i] * buffer[i];
    }
    energy /= buffer.length;

    // 如果能量太低，认为没有有效信号
    if (energy < 0.01) {
      return null;
    }

    // 计算自相关
    const autocorrelation = new Float32Array(buffer.length);
    for (let lag = 0; lag < buffer.length; lag++) {
      let sum = 0;
      for (let i = 0; i < buffer.length - lag; i++) {
        sum += buffer[i] * buffer[i + lag];
      }
      autocorrelation[lag] = sum;
    }

    // 归一化
    const maxVal = autocorrelation[0];
    if (maxVal === 0) return null;
    
    for (let i = 0; i < autocorrelation.length; i++) {
      autocorrelation[i] /= maxVal;
    }

    // 找到第一个局部最大值（排除起始点）
    let maxLag = -1;
    let maxVal2 = -1;
    let inMaxRegion = false;
    
    // 跳过前20个点（避免直流分量的影响）
    // 从对应于约 80Hz 的延迟开始搜索（80Hz = 5512/80 ≈ 69 samples at 44.1kHz）
    // 到约 1000Hz 的延迟结束（1000Hz = 5512/1000 ≈ 5 samples）
    const minLag = Math.floor(this.sampleRate / 1000); // 1000Hz
    const maxLagLimit = Math.floor(this.sampleRate / 60); // 60Hz

    for (let lag = minLag; lag < Math.min(maxLagLimit, autocorrelation.length); lag++) {
      // 检测峰值（当前值大于前后值）
      if (
        autocorrelation[lag] > 0.5 &&
        autocorrelation[lag] > autocorrelation[lag - 1] &&
        autocorrelation[lag] > autocorrelation[lag + 1]
      ) {
        if (autocorrelation[lag] > maxVal2) {
          maxVal2 = autocorrelation[lag];
          maxLag = lag;
        }
      }
    }

    if (maxLag === -1 || maxVal2 < 0.3) {
      return null;
    }

    // 使用抛物线插值优化峰值位置
    const x1 = maxLag - 1;
    const x2 = maxLag;
    const x3 = maxLag + 1;
    
    const y1 = autocorrelation[x1];
    const y2 = autocorrelation[x2];
    const y3 = autocorrelation[x3];

    // 抛物线插值公式
    const denominator = 2 * (2 * y2 - y1 - y3);
    if (denominator === 0) {
      return this.sampleRate / maxLag;
    }

    const delta = (y3 - y1) / denominator;
    const refinedLag = maxLag + delta;

    return this.sampleRate / refinedLag;
  }

  // YIN 算法（更精确的音高检测）
  detectPitchYIN(buffer: Float32Array): number | null {
    const bufferSize = buffer.length;
    const halfBufferSize = Math.floor(bufferSize / 2);
    
    // 检查信号能量
    let energy = 0;
    for (let i = 0; i < buffer.length; i++) {
      energy += buffer[i] * buffer[i];
    }
    energy /= buffer.length;
    
    if (energy < 0.01) {
      return null;
    }

    // 计算差分函数
    const yinBuffer = new Float32Array(halfBufferSize);
    
    for (let tau = 1; tau < halfBufferSize; tau++) {
      let sum = 0;
      for (let i = 0; i < halfBufferSize; i++) {
        const delta = buffer[i] - buffer[i + tau];
        sum += delta * delta;
      }
      yinBuffer[tau] = sum;
    }

    // 计算累计均值归一化差分函数
    let runningSum = 0;
    yinBuffer[0] = 1;
    
    for (let tau = 1; tau < halfBufferSize; tau++) {
      runningSum += yinBuffer[tau];
      yinBuffer[tau] *= tau / runningSum;
    }

    // 查找绝对阈值
    const absoluteThreshold = 0.15;
    let tau = 2; // 从最小延迟开始
    
    // 找到第一个低于阈值的局部最小值
    while (tau < halfBufferSize) {
      if (yinBuffer[tau] < absoluteThreshold) {
        // 找到这个局部最小值的精确位置
        while (tau + 1 < halfBufferSize && yinBuffer[tau + 1] < yinBuffer[tau]) {
          tau++;
        }
        break;
      }
      tau++;
    }

    // 如果没有找到低于阈值的点，找全局最小值
    if (tau >= halfBufferSize) {
      let minVal = Infinity;
      let minTau = 0;
      
      for (let i = 2; i < halfBufferSize; i++) {
        if (yinBuffer[i] < minVal) {
          minVal = yinBuffer[i];
          minTau = i;
        }
      }
      
      if (minVal > 0.5) {
        return null;
      }
      
      tau = minTau;
    }

    // 抛物线插值
    let betterTau = tau;
    
    if (tau > 0 && tau < halfBufferSize - 1) {
      const x0 = tau - 1;
      const x2 = tau + 1;
      
      const s0 = yinBuffer[x0];
      const s1 = yinBuffer[tau];
      const s2 = yinBuffer[x2];
      
      // 抛物线插值
      const denominator = 2 * (2 * s1 - s0 - s2);
      
      if (denominator !== 0) {
        const delta = (s2 - s0) / denominator;
        betterTau = tau + delta;
      }
    }

    // 计算频率
    const frequency = this.sampleRate / betterTau;
    
    // 验证频率范围（60Hz - 4000Hz，适合吉他）
    if (frequency < 60 || frequency > 4000) {
      return null;
    }

    return frequency;
  }
}