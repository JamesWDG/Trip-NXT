/**
 * Mock data for Kuwait Stock Exchange (Boursa Kuwait) dashboard.
 * Replace with real API (Twelve Data / Boursa Kuwait) when available.
 */

export type MarketCapType = 'large' | 'mid' | 'small';
export type SectorType =
  | 'Banks'
  | 'Banks (Islamic)'
  | 'Telecommunications'
  | 'Real Estate'
  | 'Education'
  | 'Investment';

export interface StockItem {
  ticker: string;
  company: string;
  sector: SectorType;
  price: string; // e.g. "1.017 KWD" or "816.0 fils"
  changePercent: number;
  pe: number | null;
  divYield: number | null; // e.g. 3.4 for 3.4%
  marketCap: string; // e.g. "8.89B KWD", "690M KWD"
  volume?: string; // e.g. "2.88M"
}

export interface PortfolioHolding {
  ticker: string;
  name: string;
  percent: number;
  color: string;
}

export interface AnnouncementItem {
  id: string;
  ticker: string;
  type: 'News' | 'Disclosure';
  headline: string;
  snippet: string;
  date: string;
}

export const SECTOR_OPTIONS: { label: string; value: SectorType }[] = [
  { label: 'Banks', value: 'Banks' },
  { label: 'Banks (Islamic)', value: 'Banks (Islamic)' },
  { label: 'Telecommunications', value: 'Telecommunications' },
  { label: 'Real Estate', value: 'Real Estate' },
  { label: 'Education', value: 'Education' },
  { label: 'Investment', value: 'Investment' },
];

export const MARKET_CAP_OPTIONS = [
  { label: 'Large Cap (>500M KWD)', value: 'large' as MarketCapType },
  { label: 'Mid Cap (100-500M)', value: 'mid' as MarketCapType },
  { label: 'Small Cap (<100M)', value: 'small' as MarketCapType },
];

/** Default stock list for screener / table */
export const MOCK_STOCKS: StockItem[] = [
  {
    ticker: 'KFH',
    company: 'Kuwait Finance House',
    sector: 'Banks (Islamic)',
    price: '816.0 fils',
    changePercent: 0.12,
    pe: 27.2,
    divYield: 2.5,
    marketCap: '14.04B KWD',
    volume: '2.88M',
  },
  {
    ticker: 'NBK',
    company: 'National Bank of Kuwait',
    sector: 'Banks',
    price: '1.017 KWD',
    changePercent: 0.49,
    pe: 14.5,
    divYield: 3.4,
    marketCap: '8.89B KWD',
    volume: '1.46M',
  },
  {
    ticker: 'BOUBYAN',
    company: 'Boubyan Bank',
    sector: 'Banks (Islamic)',
    price: '726.0 fils',
    changePercent: 0,
    pe: 36.3,
    divYield: 1.4,
    marketCap: '3.20B KWD',
    volume: '763K',
  },
  {
    ticker: 'ZAIN',
    company: 'Mobile Telecommunications (Zain)',
    sector: 'Telecommunications',
    price: '522.0 fils',
    changePercent: 0.38,
    pe: 8.7,
    divYield: 11.5,
    marketCap: '2.26B KWD',
  },
  {
    ticker: 'MABANEE',
    company: 'Mabanee Company',
    sector: 'Real Estate',
    price: '1.150 KWD',
    changePercent: -0.09,
    pe: 19.2,
    divYield: 1.2,
    marketCap: '1.70B KWD',
    volume: '1.73M',
  },
  {
    ticker: 'GBK',
    company: 'Gulf Bank',
    sector: 'Banks',
    price: '362.0 fils',
    changePercent: -0.28,
    pe: 36.2,
    divYield: 2.8,
    marketCap: '1.44B KWD',
  },
  {
    ticker: 'STC',
    company: 'Kuwait Telecom (STC)',
    sector: 'Telecommunications',
    price: '686.0 fils',
    changePercent: -0.29,
    pe: 22.9,
    divYield: 5.1,
    marketCap: '690M KWD',
  },
  {
    ticker: 'HUMANSOFT',
    company: 'Humansoft Holding',
    sector: 'Education',
    price: '2.615 KWD',
    changePercent: 0.19,
    pe: 9.7,
    divYield: 13.4,
    marketCap: '350M KWD',
  },
  {
    ticker: 'IMTIAZ',
    company: 'Al Imtiaz Investment',
    sector: 'Investment',
    price: '60.3 fils',
    changePercent: -0.5,
    pe: null,
    divYield: null,
    marketCap: '70M KWD',
    volume: '853K',
  },
];

export const MOCK_PORTFOLIO = {
  totalValue: '16,785 KWD',
  todayChange: '+149 KWD',
  todayPercent: 0.89,
  totalReturn: 5.29,
  holdings: [
    { ticker: 'NBK', name: 'NBK', percent: 28, color: '#8B5CF6' },
    { ticker: 'KFH', name: 'KFH', percent: 22, color: '#22C55E' },
    { ticker: 'ZAIN', name: 'ZAIN', percent: 23, color: '#3B82F6' },
    { ticker: 'HUMANSOFT', name: 'HUMANSOFT', percent: 15, color: '#F59E0B' },
  ] as PortfolioHolding[],
};

export const MOCK_MARKET_OVERVIEW = {
  allShareIndex: 7245.32,
  allShareChange: 42.18,
  allSharePercent: 0.59,
  premierMarket: 8124.56,
  premierPercent: 0.62,
  volume: '8.94M shares',
  value: '12.50M KWD',
  advancers: 4,
  decliners: 4,
  unchanged: 1,
};

export const MOCK_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: '1',
    ticker: 'NBK',
    type: 'News',
    headline: 'Kuwait: Household lending growth hits three-year high',
    snippet:
      'Domestic credit growth remained robust in Q3 (+1.3%), driving up the YTD increase to 6%.',
    date: 'Nov 5',
  },
  {
    id: '2',
    ticker: 'NBK',
    type: 'News',
    headline: 'Kuwait: GDP growth accelerates in Q2 on oil and non-oil sector gains',
    snippet:
      'Preliminary estimates show GDP expanding for the second consecutive quarter in Q2 2025.',
    date: 'Nov 3',
  },
  {
    id: '3',
    ticker: 'NBK',
    type: 'News',
    headline: 'Kuwait Economic Brief: Key economic metrics continue to improve',
    snippet: 'Economic indicators show positive momentum across multiple sectors.',
    date: 'Sep 25',
  },
  {
    id: '4',
    ticker: 'ZAIN',
    type: 'Disclosure',
    headline: 'Zain completes 5G network expansion in Kuwait City',
    snippet: '200M KWD investment drives nationwide 5G coverage expansion.',
    date: 'Dec 20',
  },
];
