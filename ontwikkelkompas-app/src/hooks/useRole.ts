import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useUser } from "./useUser";

export function useRole() {
  const user = useUser();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => setRole(data?.role || null));
  }, [user]);

  return role;
}