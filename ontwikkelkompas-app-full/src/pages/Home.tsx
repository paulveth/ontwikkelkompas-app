import React from "react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  return (
    <main className="p-4 grid gap-4" data-tour="home">
      <h1 className="text-xl font-bold">Welkom bij het Ontwikkelkompas</h1>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-xl"
        onClick={() => navigate(`/day/${today}`)}
        data-tour="cta-day"
      >
        Naar dagschema van vandaag
      </button>
      <h2 className="text-lg mt-6">Kindprofielen</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-tour="child-list">
        {["joah", "emma", "levi"].map((child) => (
          <div
            key={child}
            onClick={() => navigate(`/child/${child}`)}
            className="cursor-pointer rounded-xl border bg-white p-4 shadow-sm"
          >
            <p className="font-semibold capitalize">{child}</p>
            <p className="text-sm text-slate-500">Klik voor observaties</p>
          </div>
        ))}
      </div>
    </main>
  );
};