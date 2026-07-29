import { LandingNav } from "@/components/landing/landing-nav";
import { Hero } from "@/components/landing/hero";
import { ExerciseSection } from "@/components/landing/exercise-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { ProfessionalCta } from "@/components/landing/professional-cta";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <LandingNav />
      <main className="flex-1">
        <Hero />
        <ExerciseSection />
        <HowItWorks />
        <FeaturesGrid />
        <ProfessionalCta />
      </main>
      <LandingFooter />
    </div>
  );
}
