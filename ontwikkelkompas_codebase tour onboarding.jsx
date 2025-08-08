// 🚀 Ontwikkelkompas Codebase – met First-Use Onboarding
// Stack: React + Tailwind + (ShadCN ready), Supabase (auth, data), Netlify Functions, PWA

// ==========================
// 📁 public/manifest.json
// ==========================
{
  "short_name": "Kompas",
  "name": "Ontwikkelkompas App",
  "icons": [
    { "src": "icon-192.png", "type": "image/png", "sizes": "192x192" },
    { "src": "icon-512.png", "type": "image/png", "sizes": "512x512" }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#ffffff",
  "background_color": "#ffffff"
}

// ==========================
// 📁 public/service-worker.js
// ==========================
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// ==========================
// 📁 src/index.css
// ==========================
@tailwind base;
@tailwind components;
@tailwind utilities;

// ==========================
// 📁 src/main.tsx
// ==========================
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js");
  });
}

// ==========================
// 📁 src/App.tsx
// ==========================
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

  // Gate onboarding: als nodig, forceer naar /onboarding
  if (!loading && user && needsOnboarding && !isOnboardingRoute) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="min-h-screen bg-muted font-sans">
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

// ==========================
// 📁 src/components/Navbar.tsx
// ==========================
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Auth } from "./Auth";

export const Navbar = () => {
  const { pathname } = useLocation();
  const hideNav = pathname.startsWith("/onboarding");
  if (hideNav) return null;
  return (
    <nav className="bg-white shadow p-4 flex items-center justify-between">
      <div className="flex gap-6">
        <Link to="/" className="font-semibold">Home</Link>
        <Link to="/day/" className="text-muted-foreground">Vandaag</Link>
      </div>
      <Auth />
    </nav>
  );
};

// ==========================
// 📁 src/components/Auth.tsx
// ==========================
import React from "react";
import { supabase } from "../lib/supabase";

export const Auth = () => {
  const signIn = async () => {
    const email = prompt("Voer je e-mailadres in:") || "";
    if (!email) return;
    await supabase.auth.signInWithOtp({ email });
    alert("Check je e-mail voor de login-link.");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="space-x-4">
      <button onClick={signIn} className="bg-primary text-white px-4 py-1 rounded">Inloggen</button>
      <button onClick={signOut} className="bg-muted text-sm px-3 py-1 rounded">Uitloggen</button>
    </div>
  );
};

// ==========================
// 📁 src/pages/Home.tsx
// ==========================
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card"; // shadcn ready

export const Home = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  return (
    <main className="p-4 grid gap-4">
      <h1 className="text-xl font-bold">Welkom bij het Ontwikkelkompas</h1>
      <button
        className="bg-primary text-white px-4 py-2 rounded-xl"
        onClick={() => navigate(`/day/${today}`)}
      >
        Naar dagschema van vandaag
      </button>
      <h2 className="text-lg mt-6">Kindprofielen</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["joah", "emma", "levi"].map((child) => (
          <Card key={child} onClick={() => navigate(`/child/${child}`)} className="cursor-pointer">
            <CardContent className="p-4">
              <p className="font-semibold capitalize">{child}</p>
              <p className="text-sm text-muted-foreground">Klik voor observaties</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
};

// ==========================
// 📁 src/pages/DayOverview.tsx
// ==========================
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
      // haal observatie-notities + doelen op en vraag AI om plan
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
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Dagschema voor {date}</h1>
      <ul className="list-disc list-inside">
        {plan.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </main>
  );
};

// ==========================
// 📁 src/pages/ChildProfile.tsx
// ==========================
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getObservations, addObservation } from "../lib/observations";

export const ChildProfile = () => {
  const { id } = useParams();
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    if (id) getObservations(id).then(setNotes);
  }, [id]);

  const handleSubmit = async () => {
    if (!id || !newNote) return;
    await addObservation(id, newNote);
    setNewNote("");
    getObservations(id).then(setNotes);
  };

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-bold capitalize">Observaties voor {id}</h1>

      <div className="space-y-2">
        <textarea
          placeholder="Nieuwe observatie"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button onClick={handleSubmit} className="bg-primary text-white px-4 py-1 rounded">
          Toevoegen
        </button>
      </div>

      <ul className="list-disc list-inside pt-4">
        {notes.map((obs) => (
          <li key={obs.id}>
            <strong>{obs.date}</strong>: {obs.note}
          </li>
        ))}
      </ul>
    </main>
  );
};

// ==========================
// 📁 src/pages/Onboarding.tsx
// ==========================
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
    await upsertUserRole(role);
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
            <button className={`px-4 py-2 rounded border ${role==='ouder'?'bg-primary text-white':''}`} onClick={() => setRole("ouder")}>Ouder</button>
            <button className={`px-4 py-2 rounded border ${role==='begeleider'?'bg-primary text-white':''}`} onClick={() => setRole("begeleider")}>Begeleider</button>
          </div>
          <button onClick={saveRole} className="bg-primary text-white px-4 py-2 rounded">Doorgaan</button>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">2) Voeg je kind(eren) toe</h2>
          <input placeholder="child_id (bijnaam, uniek)" value={childId} onChange={e=>setChildId(e.target.value)} className="w-full p-2 border rounded" />
          <input placeholder="Bijnaam (weergave)" value={nickname} onChange={e=>setNickname(e.target.value)} className="w-full p-2 border rounded" />
          <input placeholder="Geboortedatum (YYYY-MM-DD)" value={birthdate} onChange={e=>setBirthdate(e.target.value)} className="w-full p-2 border rounded" />
          <button onClick={saveChild} className="bg-primary text-white px-4 py-2 rounded">Kind toevoegen</button>
          <ul className="list-disc list-inside">
            {children.map(c=> (<li key={c.child_id}><strong>{c.nickname||c.child_id}</strong> – {c.birthdate||'geen datum'}</li>))}
          </ul>
          <button onClick={()=>setStep(3)} className="bg-primary text-white px-4 py-2 rounded">Doorgaan</button>
        </section>
      )}

      {step === 3 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">3) Stel eerste kwartaaldoelen in</h2>
          <p className="text-sm text-muted-foreground">Scheiding met komma's, bijv.: taal, rekenen, natuur, sociaal-emotioneel</p>
          <textarea value={goalText} onChange={e=>setGoalText(e.target.value)} placeholder="Doelen, komma-gescheiden" className="w-full p-2 border rounded" />
          <button onClick={saveGoals} className="bg-primary text-white px-4 py-2 rounded">Opslaan & doorgaan</button>
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
          <button onClick={finish} className="bg-primary text-white px-4 py-2 rounded">Start met het Kompas</button>
        </section>
      )}
    </main>
  );
};

// ==========================
// 📁 src/utils/generateDayPlan.ts
// ==========================
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

// ==========================
// 📁 src/lib/supabase.ts
// ==========================
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==========================
// 📁 src/hooks/useUser.ts
// ==========================
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
export function useUser() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data?.session?.user || null));
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => setUser(session?.user || null));
    return () => listener?.subscription.unsubscribe();
  }, []);
  return user;
}

// ==========================
// 📁 src/hooks/useFirstRun.ts
// ==========================
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useUser } from "./useUser";
export function useFirstRun() {
  const user = useUser();
  const [needsOnboarding, setNeeds] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const run = async () => {
      if (!user) { setLoading(false); return; }
      const { data, error } = await supabase
        .from("user_settings")
        .select("onboarding_completed")
        .eq("user_id", user.id)
        .single();
      if (error || !data) setNeeds(true);
      else setNeeds(!data.onboarding_completed);
      setLoading(false);
    };
    run();
  }, [user]);
  return { needsOnboarding, loading };
}

// ==========================
// 📁 src/hooks/useTour.ts
// ==========================
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useUser } from "./useUser";
export function useTour() {
  const user = useUser();
  const [needsTour, setNeedsTour] = useState(false);
  useEffect(() => {
    const run = async () => {
      if (!user) { setNeedsTour(false); return; }
      const { data } = await supabase
        .from("user_settings")
        .select("tour_completed, onboarding_completed")
        .eq("user_id", user.id)
        .single();
      if (!data) { setNeedsTour(false); return; }
      setNeedsTour(!!data.onboarding_completed && !data.tour_completed);
    };
    run();
  }, [user]);
  return { needsTour };
}

// ==========================
// 📁 src/lib/settings.ts
// ==========================
import { supabase } from "./supabase";
export async function completeOnboarding() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("user_settings").upsert({ user_id: user.id, onboarding_completed: true }, { onConflict: "user_id" });
}
export async function completeTour() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("user_settings").upsert({ user_id: user.id, tour_completed: true }, { onConflict: "user_id" });
}


// ==========================
// 📁 src/components/GuidedTour.tsx
// ==========================
import React, { useState } from "react";
import { completeTour } from "../lib/settings";

const STEPS = [
  {
    title: "Welkom!",
    body: "Dit is je thuisscherm. Hier start je de dag en open je kindprofielen.",
  },
  {
    title: "Dagschema",
    body: "Klik op 'Naar dagschema van vandaag' om het AI- of basisdagplan te zien.",
  },
  {
    title: "Kindobservaties",
    body: "Open een kindkaart om observaties toe te voegen. Houd het kort en positief.",
  },
];

export function GuidedTour() {
  const [i, setI] = useState(0);
  const last = i === STEPS.length - 1;

  const next = async () => {
    if (!last) return setI(i + 1);
    await completeTour();
    // Sluit overlay door simpele reload zodat hook opnieuw checkt
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md m-4">
        <h3 className="text-lg font-semibold mb-2">{STEPS[i].title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{STEPS[i].body}</p>
        <div className="flex justify-end gap-2">
          <button onClick={next} className="bg-primary text-white px-4 py-2 rounded">
            {last ? "Starten" : "Volgende"}
          </button>
        </div>
      </div>
    </div>
  );
}
