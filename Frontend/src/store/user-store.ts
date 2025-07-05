import { create } from "zustand";
import { User } from "../../../common/contract";

interface UserState {
  user: User | null;
  accessToken: string | null;
  isNewUser: boolean; // Flag to track new user onboarding
  login: (user: User, accessToken: string, isNew?: boolean) => void;
  logout: () => void;
  setAccessToken: (token: string | null) => void;
  completeOnboarding: () => void; // Action to clear the flag
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  accessToken: null,
  isNewUser: false,
  login: (user, accessToken, isNew = false) =>
    set({ user, accessToken, isNewUser: isNew }),
  logout: () => set({ user: null, accessToken: null, isNewUser: false }),
  setAccessToken: (token) => set({ accessToken: token }),
  completeOnboarding: () => set({ isNewUser: false }),
}));

export default useUserStore;
