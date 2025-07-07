import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import NavbarDropdown from "./_components/NavbarDropdown";

import styles from "./_styles/Navbar.module.css";

export default function Navbar() {
  const navigate = useNavigate();

  const [isVertical, setIsVertical] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const { width } = entry.contentRect;
      setIsVertical(width <= 500);
    });

    if (containerRef.current?.parentElement)
      observer.observe(containerRef.current.parentElement);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={styles["navbar-wrapper"]}>
      <div className={styles.title} onClick={() => navigate("/")}>
        Supabase | Auth Template
      </div>
      <NavbarDropdown isVertical={isVertical} />
    </div>
  );
}
