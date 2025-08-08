export async function getSuggestedPlan(observations: string[], goals: string[]): Promise<string[]> {
  const prompt = `Maak een dagschema voor een leerdag in een thuisonderwijssetting. Houd rekening met observaties: ${observations.join(", ")} en doelen: ${goals.join(", ")}. Max 6 blokken.`;
  const response = await fetch("/.netlify/functions/ai-plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });
  const data = await response.json();
  return data.plan || [];
}