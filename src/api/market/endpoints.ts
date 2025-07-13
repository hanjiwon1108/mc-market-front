export const ENDPOINTS = {
  // 정산 관련 엔드포인트
  SETTLEMENT: {
    // 특정 월의 정산 정보 조회
    MONTHLY: (month: string) => `/settlements?month=${month}`,

    // 기간별 정산 정보 조회
    RANGE: (startMonth: string, endMonth: string) =>
      `/settlements/range?start_month=${startMonth}&end_month=${endMonth}`,
  },
};
