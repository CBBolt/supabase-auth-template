import { useEffect, useState } from "react";
import { getSupabaseClient } from "../supabaseClient";
import { type Session } from "@supabase/supabase-js";

export default function useGetSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const signIn = async () => {
      const supabase = getSupabaseClient();
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        setError(error);
      } else {
        setSession(session || null);
      }

      setLoading(false);
    };

    signIn();
  }, []);

  return { session, error, loading };
}
