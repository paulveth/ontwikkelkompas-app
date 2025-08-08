import { supabase } from "./supabase";
export async function addChild({ child_id, nickname, birthdate }: { child_id: string; nickname?: string; birthdate?: string; }) {
  await supabase.from("children").upsert({ child_id, nickname, birthdate });
}
export async function listChildren() {
  const { data } = await supabase.from("children").select("child_id, nickname, birthdate");
  return data || [];
}