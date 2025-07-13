'use client';
import React from 'react';

export function SponsorChartSection() {
  // 차트 데이터 및 최대값
  const chartData = [10, 20, 30, 40, 50, 60, 70, 80];
  const maxValue = 100; // 최대 표시 값

  // Y축 눈금 값 생성 (0, 20, 40, 60, 80, 100)
  const yAxisLabels = Array.from({ length: 6 }, (_, i) => maxValue - i * 20);

  return (
    <div className="flex flex-col rounded-lg bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">후원 수익 그래프</h2>

      <div className="h-56 w-full rounded-lg bg-gray-50 p-4">
        <div className="flex h-full">
          {/* Y축 레이블 */}
          <div className="mr-4 flex flex-col justify-between">
            {yAxisLabels.map((label, index) => (
              <div
                key={index}
                className="flex items-center text-xs text-gray-500"
              >
                <span>{label.toLocaleString()}원</span>
              </div>
            ))}
          </div>

          {/* 그래프 영역 */}
          <div className="relative flex-1">
            {/* 그리드 라인 */}
            {yAxisLabels.map((_, index) => (
              <div
                key={index}
                className="absolute border-t border-gray-200"
                style={{
                  top: `${index * 20}%`,
                  left: 0,
                  right: 0,
                  height: '1px',
                }}
              />
            ))}

            {/* 꺾은선 그래프 */}
            <div className="absolute inset-0">
              <svg
                className="h-full w-full"
                preserveAspectRatio="none"
                viewBox="0 0 7 100"
              >
                <polyline
                  points="0,90 1,80 2,70 3,60 4,50 5,40 6,30 7,20"
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="0.2"
                />
              </svg>
            </div>

            {/* 데이터 포인트 마커 */}
            <div className="absolute inset-0">
              {chartData.map((height, index) => {
                const x = `${(index / (chartData.length - 1)) * 100}%`;
                const y = `${100 - height}%`;
                return (
                  <div
                    key={index}
                    className="absolute h-3 w-3 -translate-x-1.5 -translate-y-1.5 rounded-full border-2 border-blue-400 bg-white"
                    style={{
                      left: x,
                      top: y,
                    }}
                  ></div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* X축 레이블 */}
      <div className="mt-1 flex justify-between px-6">
        {['6/30', '7/1', '7/2', '7/3', '7/4', '7/5', '7/6', '7/7'].map(
          (date, index) => (
            <div key={index} className="text-xs text-gray-500">
              {date}
            </div>
          ),
        )}
      </div>
    </div>
  );
}
