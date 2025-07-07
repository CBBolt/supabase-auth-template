import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { useSupabaseHealthCheck } from "../../../services/supabase/_hooks/useSupabaseHealthCheck";
import { useAuth } from "../../../components/auth/AuthContext";
import { useHostedServerHealthCheck } from "../../../hooks/useHostedSeverHealthCheck";

import HealthStatus from "./HealthStatus";

import styles from "../_styles/Navbar.module.css";

export default function NavbarDropdown({
  isVertical,
}: {
  isVertical: boolean;
}) {
  const { isHealthy: supaHealth, statusMessage: supaStatus } =
    useSupabaseHealthCheck();
  const { isHealthy: serverHealth, statusMessage: serverStatus } =
    useHostedServerHealthCheck();

  const { user, signOut } = useAuth();

  const [expanded, setExpanded] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setExpanded(false);
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles["navbar-items"]}>
      <div>
        {user ? (
          <div className={styles["navbar-links"]}>
            {!isVertical && (
              <span className={styles.username}>{user.username}</span>
            )}
            <div
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className={styles["dropdown-toggle"]}
            >
              =
            </div>
            <div
              ref={dropdownRef}
              className={`${styles.dropdown} ${
                expanded ? styles.expanded : ""
              }`}
            >
              {isVertical && (
                <span className={styles.username}>{user.username}</span>
              )}
              <button onClick={signOut}>Logout</button>
              <HealthStatus
                server="supabase"
                healthy={supaHealth}
                message={supaStatus}
              />
              <HealthStatus
                server="server"
                healthy={serverHealth}
                message={serverStatus}
              />
            </div>
          </div>
        ) : (
          <div className={styles["navbar-links"]}>
            <Link to="/login">Login</Link>
            <span>|</span>
            <Link to="/signup">Sign Up</Link>
          </div>
        )}
      </div>
    </div>
  );
}
