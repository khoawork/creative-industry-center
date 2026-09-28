import React from "react";
import AboutLayout from "../../components/About/about-layout";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#faf9f7] font-sans antialiased text-[#1a1c1b]">
      <main className="w-full pt-24 min-h-[calc(100vh-6rem)]">
        <AboutLayout />
      </main>
    </div>
  );
}
