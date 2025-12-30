import AboutSection from "@/components/about-section";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-8 md:p-12">
      <div className="max-w-3xl w-full">
        <AboutSection />
      </div>
    </div>
  );
}
