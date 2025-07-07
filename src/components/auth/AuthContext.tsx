/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { getSupabaseClient } from "../../services/supabase/supabaseClient";
import { useNavigate } from "react-router-dom";
import useGetSession from "../../services/supabase/_hooks/useGetSession";

import { type User } from "./_types/auth";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => void;
  signUp: (email: string, password: string, userData: User) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  signIn: () => {},
  signUp: () => {},
  signOut: () => {},
});

type AuthProps = {
  authUser: User | null;
  authUserId: string | null;
  loading: boolean;
  error: Error | null;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authProps, setAuthProps] = useState<AuthProps>({
    authUser: null,
    authUserId: null,
    loading: false,
    error: null,
  });

  const { session, error: sessionError } = useGetSession();

  const navigate = useNavigate();

  const supabase = getSupabaseClient();

  async function signIn(email: string, password: string) {
    setAuthProps((prev) => ({ ...prev, loading: true, error: null }));
    const {
      data: { user },
      error: signInError,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!signInError) navigate("/");

    setAuthProps((prev) => ({
      ...prev,
      authUserId: user?.id || null,
      loading: false,
      error: signInError,
    }));
  }

  async function signUp(
    email: string,
    password: string,
    userData: { username: string }
  ) {
    setAuthProps((prev) => ({ ...prev, loading: true, error: null }));
    const {
      data: { user },
      error: signUpError,
    } = await supabase.auth.signUp({
      email,
      password,
    });

    if (user && !signUpError) {
      const { error: createUserError } = await supabase
        .from("profiles")
        .insert([
          {
            auth_id: user.id,
            username: userData.username,
            created_at: new Date().toISOString(),
          },
        ]);

      setAuthProps((prev) => ({
        ...prev,
        loading: false,
        error: createUserError,
      }));
    } else {
      setAuthProps((prev) => ({
        ...prev,
        loading: false,
        error: signUpError,
      }));
    }

    if (!signUpError) navigate("/");

    setAuthProps((prev) => ({
      ...prev,
      authUserId: user?.id || null,
      loading: false,
      error: null,
    }));
  }

  async function signOut() {
    setAuthProps((prev) => ({ ...prev, loading: true, error: null }));
    const { error: signOutError } = await supabase.auth.signOut({});

    navigate("/");

    setAuthProps({
      authUser: null,
      authUserId: null,
      loading: false,
      error: signOutError,
    });
  }

  const getSignedInUser = useCallback(async () => {
    if (authProps.authUserId === null) return;

    setAuthProps((prev) => ({ ...prev, loading: true, error: null }));
    const { data: user, error: getUserError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authProps.authUserId);

    setAuthProps((prev) => ({
      ...prev,
      authUser: (user?.[0] as User) || null,
      loading: false,
      error: getUserError,
    }));
  }, [authProps.authUserId, supabase]);

  useEffect(() => {
    if (sessionError) {
      setAuthProps((prev) => ({
        ...prev,
        authUserId: null,
        error: sessionError,
      }));
      return;
    }

    if (session)
      setAuthProps((prev) => ({ ...prev, authUserId: session.user.id }));
  }, [session, sessionError]);

  useEffect(() => {
    getSignedInUser();
  }, [authProps.authUserId, getSignedInUser]);

  return (
    <AuthContext.Provider
      value={{
        user: authProps.authUser,
        loading: authProps.loading,
        error: authProps.error,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
