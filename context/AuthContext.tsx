import { apiFetch } from "@/constants/api";
// import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import * as SecureStore from "expo-secure-store";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";
const GUEST_KEY = "auth_is_guest";

export type User = {
  user_id: string;
  email: string;
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
  updateNickname: (nickname: string) => Promise<void>;
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
    (async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const isGuest = (await SecureStore.getItemAsync(GUEST_KEY)) === "true";
      const userJson = await SecureStore.getItemAsync(USER_KEY);
      if (!userJson || (!token && !isGuest)) {
        setState((s) => ({ ...s, isLoading: false }));
        return;
      }

      const cachedUser = JSON.parse(userJson) as User;
      setState({ token, user: cachedUser, isGuest, isLoading: false });

      if (token && !isGuest && cachedUser.user_id) {
        try {
          const fresh = await apiFetch<User>(`/users/${cachedUser.user_id}`);
          await SecureStore.setItemAsync(USER_KEY, JSON.stringify(fresh));
          setState((s) => ({ ...s, user: fresh }));
        } catch {
          // ネットワーク失敗時はキャッシュをそのまま使う
        }
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
    async (email: string, password: string) => {
      const res = await apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      await saveSession(res.token, res.user, false);
    },
    [saveSession],
  );

  const register = useCallback(
    async (email: string, nickname: string, password: string) => {
      const res = await apiFetch<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, nickname, password }),
      });
      await saveSession(res.token, res.user, false);
    },
    [saveSession],
  );

  const loginAsGuest = useCallback(async () => {
    const guestUser: User = {
      user_id: "",
      email: "",
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
    setState({ token: null, user: null, isGuest: false, isLoading: false });
  }, []);

  const updateNickname = useCallback(
    async (nickname: string) => {
      const currentUser = state.user;
      if (!currentUser || state.isGuest) return;

      const updated = await apiFetch<User>(`/users/${currentUser.user_id}`, {
        method: "PUT",
        body: JSON.stringify({ nickname }),
      });
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(updated));
      setState((s) => ({ ...s, user: updated }));
    },
    [state.user, state.isGuest],
  );

  return (
    <AuthContext value={{ ...state, login, register, loginAsGuest, logout, updateNickname }}>
      {children}
    </AuthContext>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
