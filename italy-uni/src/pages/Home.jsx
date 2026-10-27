import Hero from '../components/home/Hero';
import StatsStrip from '../components/home/StatsStrip';
import FeaturedUnis from '../components/home/FeaturedUnis';
import CitiesSection from '../components/home/CitiesSection';
import StepsSection from '../components/home/StepsSection';
import Testimonials from '../components/home/Testimonials';
import FAQ from '../components/home/FAQ';
import CTASection from '../components/home/CTASection';
import { useTitle } from '../hooks';

export default function Home() {
  useTitle();
  return (
    <>
      <Hero />
      <StatsStrip />
      <FeaturedUnis />
      <CitiesSection />
      <StepsSection />
      <Testimonials />
      <FAQ />
      <CTASection />
    </>
  );
}
