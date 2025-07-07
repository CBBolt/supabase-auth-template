import styles from "../_styles/Navbar.module.css";

export default function HealthStatus({
  server,
  healthy,
  message,
}: {
  server: string;
  healthy: boolean;
  message: string;
}) {
  return (
    <div className={styles["sb-error"]}>
      <div
        className={`${styles.status} ${healthy ? styles.good : styles.bad}`}
      />
      <span>{server}</span>
      <div className={styles["sb-error-msg"]}>{message}</div>
    </div>
  );
}
