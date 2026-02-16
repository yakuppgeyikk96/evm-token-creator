import { HeroSection } from "./_components/hero-section";
import { FeaturesSection } from "./_components/features-section";
import { HowItWorksSection } from "./_components/how-it-works-section";
import { WhyBaseSection } from "./_components/why-base-section";
import { BottomCta } from "./_components/bottom-cta";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <WhyBaseSection />
      <BottomCta />
    </div>
  );
}
