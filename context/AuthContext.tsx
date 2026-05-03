import { apiFetch } from "@/constants/api";
// import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import * as SecureStore from "expo-secure-store";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";
const GUEST_KEY = "auth_is_guest";

export type User = {
  user_id: string;
  nickname: string;
  level: number;
  exp: number;
  points: number;
  alert_enabled: boolean;
  theme: string;
};

type AuthResponse = {
  token: string;
  user: User;
};

type AuthState = {
  token: string | null;
  user: User | null;
  isGuest: boolean;
  isLoading: boolean;
};

type AuthContextValue = AuthState & {
  login: (userId: string, password: string) => Promise<void>;
  register: (userId: string, nickname: string, password: string) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token: null,
    user: null,
    isGuest: false,
    isLoading: true,
  });

  useEffect(() => {
    // GoogleSignin.configure({
    //   // Google Cloud Console の Web クライアント ID を設定してください
    //   webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? "",
    //   iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? "",
    // });

    (async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const isGuest = (await SecureStore.getItemAsync(GUEST_KEY)) === "true";
      const userJson = await SecureStore.getItemAsync(USER_KEY);
      if (userJson && (token || isGuest)) {
        setState({ token, user: JSON.parse(userJson) as User, isGuest, isLoading: false });
      } else {
        setState((s) => ({ ...s, isLoading: false }));
      }
    })();
  }, []);

  const saveSession = useCallback(async (token: string, user: User, isGuest: boolean) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    await SecureStore.setItemAsync(GUEST_KEY, String(isGuest));
    setState({ token, user, isGuest, isLoading: false });
  }, []);

  const login = useCallback(
    async (userId: string, password: string) => {
      const res = await apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ user_id: userId, password }),
      });
      await saveSession(res.token, res.user, false);
    },
    [saveSession],
  );

  const register = useCallback(
    async (userId: string, nickname: string, password: string) => {
      const res = await apiFetch<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ user_id: userId, nickname, password }),
      });
      await saveSession(res.token, res.user, false);
    },
    [saveSession],
  );

  // const googleLogin = useCallback(async () => {
  //   await GoogleSignin.hasPlayServices();
  //   const signInResult = await GoogleSignin.signIn();
  //   const idToken = signInResult.data?.idToken;
  //   if (!idToken) throw new Error("Google サインインに失敗しました");
  //   const res = await apiFetch<AuthResponse>("/auth/google", {
  //     method: "POST",
  //     body: JSON.stringify({ id_token: idToken }),
  //   });
  //   await saveSession(res.token, res.user, false);
  // }, [saveSession]);

  const loginAsGuest = useCallback(async () => {
    const guestUser: User = {
      user_id: "",
      nickname: "ゲスト",
      level: 1,
      exp: 0,
      points: 0,
      alert_enabled: true,
      theme: "light",
    };
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(guestUser));
    await SecureStore.setItemAsync(GUEST_KEY, "true");
    setState({ token: null, user: guestUser, isGuest: true, isLoading: false });
  }, []);

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    await SecureStore.deleteItemAsync(GUEST_KEY);
    // try {
    //   await GoogleSignin.signOut();
    // } catch {}
    setState({ token: null, user: null, isGuest: false, isLoading: false });
  }, []);

  return (
    <AuthContext value={{ ...state, login, register, loginAsGuest, logout }}>
      {children}
    </AuthContext>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
