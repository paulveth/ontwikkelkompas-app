import { supabase } from "./supabase";
export async function getObservations(child_id: string) {
  const { data, error } = await supabase
    .from("observations")
    .select("id, date, note")
    .eq("child_id", child_id)
    .order("date", { ascending: false });
  if (error) return [];
  return data || [];
}
export async function addObservation(child_id: string, note: string) {
  await supabase.from("observations").insert({ child_id, note, date: new Date().toISOString().split("T")[0] });
}
export async function getRecentObservationNotes(limit: number = 10) {
  const { data } = await supabase.from("observations").select("note").order("date", { ascending: false }).limit(limit);
  return (data || []).map((d:any)=>d.note);
}