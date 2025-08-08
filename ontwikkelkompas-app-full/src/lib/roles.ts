import { supabase } from "./supabase";
export async function upsertUserRole(role: "ouder" | "begeleider") {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("user_roles").upsert({ user_id: user.id, role }, { onConflict: "user_id" });
}
export async function getUserRole() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).single();
  return data?.role || null;
}