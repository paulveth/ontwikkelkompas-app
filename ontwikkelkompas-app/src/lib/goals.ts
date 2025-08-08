import { supabase } from "./supabase";

export async function getGoals(child_id: string) {
  const { data, error } = await supabase
    .from("goals")
    .select("goal")
    .eq("child_id", child_id);

  return data?.map(g => g.goal) || [];
}

export async function setGoals(child_id: string, goals: string[]) {
  await supabase.from("goals").delete().eq("child_id", child_id);
  const inserts = goals.map(goal => ({ child_id, goal }));
  await supabase.from("goals").insert(inserts);
}