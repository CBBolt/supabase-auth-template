import { useEffect, useState } from "react";
import { type User } from "../../../components/auth/_types/auth";
import { getSupabaseClient } from "../supabaseClient";

export default function useGetUserInfo(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId);

      if (error) {
        setError(error);
      } else {
        setUser((data?.[0] as User) || null);
      }

      setLoading(false);
    };

    fetchUser();
  }, [userId]);

  return { user, error, loading };
}
