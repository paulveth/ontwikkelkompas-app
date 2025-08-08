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