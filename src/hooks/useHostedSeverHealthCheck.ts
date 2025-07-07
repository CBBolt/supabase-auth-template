import { useEffect, useState } from "react";

const SERVER_URL = "http://localhost:5173";

export function useHostedServerHealthCheck() {
  const [isHealthy, setIsHealthy] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch(SERVER_URL, { method: "GET" });
        if (response.ok) {
          setIsHealthy(true);
          setStatusMessage("Server is up");
        }
      } catch (err: unknown) {
        setStatusMessage(`Server is down: ${err as Error}`);
        setIsHealthy(false);
      }
    };

    checkHealth();

    const interval = setInterval(checkHealth, 60000);
    return () => clearInterval(interval);
  }, []);

  return { isHealthy, statusMessage };
}
