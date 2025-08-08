import { supabase } from "./supabase";
export async function getGoals(child_id: string) {
  const { data } = await supabase.from("goals").select("goal").eq("child_id", child_id);
  return data?.map((g:any)=>g.goal) || [];
}
export async function setGoals(child_id: string, goals: string[]) {
  await supabase.from("goals").delete().eq("child_id", child_id);
  const inserts = goals.map((goal) => ({ child_id, goal }));
  if (inserts.length) await supabase.from("goals").insert(inserts);
}
export async function getAllGoals(limitPerChild: number = 10) {
  const { data } = await supabase.from("goals").select("goal").limit(limitPerChild);
  return (data || []).map((g:any)=>g.goal);
}