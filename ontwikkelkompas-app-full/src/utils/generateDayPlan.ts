export const generateDayPlan = (date: string): string[] => {
  const basePlan = [
    "Binnenkomen (vrije keuze, rustig spel)",
    "Dagstart met zang + adem + intentie",
    "Groepsopdracht: Bouw een brug met 3 materialen",
    "Lunch maken en samen eten",
    "Middag: buiten spelen en natuurverkenning",
    "Afsluiting: reflectie met tekenopdracht",
  ];
  return basePlan.map((item) => `🔹 ${item}`);
};