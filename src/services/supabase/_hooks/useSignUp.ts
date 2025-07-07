import { useEffect, useState } from "react";
import { getSupabaseClient } from "../supabaseClient";

export default function useSignUp(email: string, password: string) {
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const signUp = async () => {
      const supabase = getSupabaseClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error);
      } else {
        setUserId(user?.id || null);
      }

      setLoading(false);
    };

    signUp();
  }, [email, password]);

  return { userId, error, loading };
}
