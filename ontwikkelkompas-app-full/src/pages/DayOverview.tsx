import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { generateDayPlan } from "../utils/generateDayPlan";
import { getSuggestedPlan } from "../lib/ai";
import { getRecentObservationNotes } from "../lib/observations";
import { getAllGoals } from "../lib/goals";

export const DayOverview = () => {
  const { date } = useParams();
  const [plan, setPlan] = useState<string[]>([]);

  useEffect(() => {
    const run = async () => {
      const notes = await getRecentObservationNotes();
      const goals = await getAllGoals();
      try {
        const aiPlan = await getSuggestedPlan(notes, goals);
        if (aiPlan.length) return setPlan(aiPlan);
      } catch {}
      setPlan(generateDayPlan(date || new Date().toISOString().split("T")[0]));
    };
    run();
  }, [date]);

  return (
    <main className="p-4 space-y-4" data-tour="day">
      <h1 className="text-xl font-bold">Dagschema voor {date}</h1>
      <ul className="list-disc list-inside">
        {plan.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </main>
  );
};