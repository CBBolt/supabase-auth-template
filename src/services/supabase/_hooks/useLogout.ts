import { useEffect, useState } from "react";
import { getSupabaseClient } from "../supabaseClient";

export default function useLogout() {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const logout = async () => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      setError(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    logout();
  }, []);

  return { logout, error, loading };
}
