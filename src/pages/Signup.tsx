import { useRef } from "react";
import { useAuth } from "../components/auth/AuthContext";

export default function Signup() {
  const { signUp, error, loading } = useAuth();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h3>Sign Up</h3>

      {loading && <span>Loading...</span>}
      {error && <span>{`An error occured: ${error}`}</span>}
      <label htmlFor="username">Username</label>
      <input ref={usernameRef} id="username" type="email" />

      <label htmlFor="email">Email</label>
      <input ref={emailRef} id="email" type="email" />

      <label htmlFor="password">Password</label>
      <input ref={passwordRef} id="password" type="password" />

      <button
        onClick={() =>
          signUp(
            emailRef.current?.value as string,
            passwordRef.current?.value as string,
            { username: usernameRef.current?.value as string }
          )
        }
      >
        Login
      </button>
    </div>
  );
}
