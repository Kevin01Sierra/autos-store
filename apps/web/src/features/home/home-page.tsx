import { Hero } from './components/hero';
import { MarketPulse } from './components/market-pulse';
import { RecommendedSection } from './components/recommended-section';
import { ValueProps } from './components/value-props';

export default function HomePage() {
  return (
    <>
      <Hero />
      <RecommendedSection />
      <MarketPulse />
      <ValueProps />
    </>
  );
}
