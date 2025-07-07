import { useEffect, useState } from "react";
import { getSupabaseClient } from "../supabaseClient";

export function useSupabaseHealthCheck() {
  const [isHealthy, setIsHealthy] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const supabase = getSupabaseClient();

  useEffect(() => {
    const checkHealth = async () => {
      const { error } = await supabase.from("health").select("id").limit(1);

      if (error) {
        setStatusMessage(`Supabase error: ${JSON.stringify(error.message)}`);
        setIsHealthy(false);
      } else {
        setStatusMessage("Supabase is up");
        setIsHealthy(true);
      }
    };

    checkHealth();

    const interval = setInterval(checkHealth, 60000);
    return () => clearInterval(interval);
  }, [supabase]);

  return { isHealthy, statusMessage };
}
