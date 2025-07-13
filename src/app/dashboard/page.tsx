'use client';
import React from 'react';
import { useMapleUser } from '@/api/market/context';
import { ProfileSection } from './components/ProfileSection';
import { ProfileUrlSection } from './components/ProfileUrlSection';
import { SettlementAccountSection } from './components/SettlementAccountSection';
import { StatisticsSection } from './components/StatisticsSection';
import { SponsorStatsSection } from './components/SponsorStatsSection';
import { SponsorChartSection } from './components/SponsorChartSection';

export default function Page() {
  const user = useMapleUser();

  return (
    <>
      <div className="flex flex-col gap-6 bg-gray-50 p-4">
        {/* 프로필 섹션과 거래 통계 섹션을 가로로 배치 */}
        <div className="flex flex-col gap-6 md:flex-row">
          {/* 프로필 섹션 */}
          <div className="flex h-full w-full flex-col gap-[85px] rounded-lg bg-white p-6 shadow-sm md:w-1/2">
            <ProfileSection user={user} />
            <ProfileUrlSection />
          </div>

          {/* 거래 통계 섹션 */}
          <div className="flex h-full w-full flex-col rounded-lg bg-white p-6 shadow-sm md:w-1/2">
            <StatisticsSection />
            <div className="mt-6">
              <SettlementAccountSection />
            </div>
          </div>
        </div>

        {/* 후원 통계 섹션 */}
        <SponsorStatsSection />

        {/* 후원 수익 그래프 섹션 */}
        <SponsorChartSection />
      </div>
    </>
  );
}
