import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { Home } from "./pages/Home";
import { DayOverview } from "./pages/DayOverview";
import { ChildProfile } from "./pages/ChildProfile";
import { Onboarding } from "./pages/Onboarding";
import { Navbar } from "./components/Navbar";
import { useUser } from "./hooks/useUser";
import { useFirstRun } from "./hooks/useFirstRun";
import { useTour } from "./hooks/useTour";
import { GuidedTour } from "./components/GuidedTour";

export default function App() {
  const user = useUser();
  const { needsOnboarding, loading } = useFirstRun();
  const { needsTour } = useTour();
  const location = useLocation();

  const isOnboardingRoute = location.pathname.startsWith("/onboarding");

  if (!loading && user && needsOnboarding && !isOnboardingRoute) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/day/:date" element={<DayOverview />} />
        <Route path="/child/:id" element={<ChildProfile />} />
        <Route path="/onboarding" element={<Onboarding />} />
      </Routes>
      {user && !needsOnboarding && needsTour && location.pathname === "/" && (
        <GuidedTour />
      )}
      <Toaster position="bottom-center" />
    </div>
  );
}