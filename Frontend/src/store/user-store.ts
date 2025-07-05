import { create } from "zustand";
import { contract } from "@contract";
import { ClientInferResponseBody } from "@ts-rest/core";

// Define the User type based on the backend response
export type User = ClientInferResponseBody<typeof contract.me, 200>;

export interface UserState {
  user: User | null;
  accessToken: string | null;
  isNewUser: boolean; // Flag to track onboarding
  login: (user: User, accessToken: string, isNew?: boolean) => void; // Optional `isNew` argument
  logout: () => void;
  setAccessToken: (token: string | null) => void;
  completeOnboarding: () => void; // Method to clear the onboarding flag
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  accessToken: null,
  isNewUser: false, // Default to false
  login: (user, accessToken, isNew = false) =>
    set({ user, accessToken, isNewUser: isNew }), // Set `isNewUser` during login
  logout: () => set({ user: null, accessToken: null, isNewUser: false }), // Clear all state on logout
  setAccessToken: (token) => set({ accessToken: token, user: null }), // Set token and reset user
  completeOnboarding: () => set({ isNewUser: false }), // Clear the onboarding flag
}));

export default useUserStore;
