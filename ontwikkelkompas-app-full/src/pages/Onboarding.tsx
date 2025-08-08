import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { upsertUserRole } from "../lib/roles";
import { addChild, listChildren } from "../lib/children";
import { setGoals } from "../lib/goals";
import { completeOnboarding } from "../lib/settings";

export const Onboarding = () => {
  const user = useUser();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("ouder");
  const [childId, setChildId] = useState("");
  const [nickname, setNickname] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [goalText, setGoalText] = useState("");
  const [children, setChildren] = useState<any[]>([]);

  useEffect(() => {
    listChildren().then(setChildren);
  }, []);

  const saveRole = async () => {
    await upsertUserRole(role as any);
    setStep(2);
  };

  const saveChild = async () => {
    if (!childId) return alert("Vul een child_id in (bijnaam, uniek).");
    await addChild({ child_id: childId, nickname, birthdate });
    setChildId(""); setNickname(""); setBirthdate("");
    listChildren().then(setChildren);
  };

  const saveGoals = async () => {
    if (!children.length) return alert("Voeg eerst een kind toe.");
    const goals = goalText.split(",").map(g => g.trim()).filter(Boolean);
    await Promise.all(children.map(c => setGoals(c.child_id, goals)));
    setStep(4);
  };

  const finish = async () => {
    await completeOnboarding();
    navigate("/");
  };

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Eerste keer instellen</h1>

      {step === 1 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">1) Kies je rol</h2>
          <div className="flex gap-3">
            <button className={"px-4 py-2 rounded border " + (role==='ouder'?'bg-blue-600 text-white':'')} onClick={() => setRole("ouder")}>Ouder</button>
            <button className={"px-4 py-2 rounded border " + (role==='begeleider'?'bg-blue-600 text-white':'')} onClick={() => setRole("begeleider")}>Begeleider</button>
          </div>
          <button onClick={saveRole} className="bg-blue-600 text-white px-4 py-2 rounded">Doorgaan</button>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">2) Voeg je kind(eren) toe</h2>
          <input placeholder="child_id (bijnaam, uniek)" value={childId} onChange={e=>setChildId(e.target.value)} className="w-full p-2 border rounded" />
          <input placeholder="Bijnaam (weergave)" value={nickname} onChange={e=>setNickname(e.target.value)} className="w-full p-2 border rounded" />
          <input placeholder="Geboortedatum (YYYY-MM-DD)" value={birthdate} onChange={e=>setBirthdate(e.target.value)} className="w-full p-2 border rounded" />
          <button onClick={saveChild} className="bg-blue-600 text-white px-4 py-2 rounded">Kind toevoegen</button>
          <ul className="list-disc list-inside">
            {children.map(c=> (<li key={c.child_id}><strong>{c.nickname||c.child_id}</strong> – {c.birthdate||'geen datum'}</li>))}
          </ul>
          <button onClick={()=>setStep(3)} className="bg-blue-600 text-white px-4 py-2 rounded">Doorgaan</button>
        </section>
      )}

      {step === 3 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">3) Stel eerste kwartaaldoelen in</h2>
          <p className="text-sm text-slate-500">Scheiding met komma's, bijv.: taal, rekenen, natuur, sociaal-emotioneel</p>
          <textarea value={goalText} onChange={e=>setGoalText(e.target.value)} placeholder="Doelen, komma-gescheiden" className="w-full p-2 border rounded" />
          <button onClick={saveGoals} className="bg-blue-600 text-white px-4 py-2 rounded">Opslaan & doorgaan</button>
        </section>
      )}

      {step === 4 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">4) Zo werkt je dag</h2>
          <ul className="list-disc list-inside text-sm">
            <li>Dagstart: verbinding, zang, adem, intentie</li>
            <li>Groepsopdracht 60–90 min: uitleg → bouwen → korte afsluiting</li>
            <li>Lunch maken & eten = leren (ritme, samenwerken)</li>
            <li>Middag: buiten, bewegen, sociaal-emotioneel</li>
            <li>Avond: ouder noteert 1–2 observaties per kind</li>
          </ul>
          <button onClick={finish} className="bg-blue-600 text-white px-4 py-2 rounded">Start met het Kompas</button>
        </section>
      )}
    </main>
  );
};