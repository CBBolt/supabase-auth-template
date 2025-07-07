import { useRef } from "react";
import { useAuth } from "../components/auth/AuthContext";

export default function Login() {
  const { signIn, error, loading } = useAuth();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h3>Login</h3>

      {loading && <span>Loading...</span>}
      {error && <span>{`An error occured: ${error}`}</span>}
      <label htmlFor="email">Email</label>
      <input ref={emailRef} id="email" type="email" />

      <label htmlFor="password">Password</label>
      <input ref={passwordRef} id="password" type="password" />

      <button
        onClick={() =>
          signIn(
            emailRef.current?.value as string,
            passwordRef.current?.value as string
          )
        }
      >
        Login
      </button>
    </div>
  );
}
