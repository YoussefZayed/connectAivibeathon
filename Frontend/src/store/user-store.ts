import { create } from 'zustand';
import { contract } from '@contract';
import { ClientInferResponseBody } from '@ts-rest/core';

export type User = ClientInferResponseBody<typeof contract.me, 200>;

export interface UserState {
    user: User | null;
    accessToken: string | null;
    login: (user: User, accessToken: string) => void;
    logout: () => void;
    setAccessToken: (token: string | null) => void;
}

const useUserStore = create<UserState>((set) => ({
    user: null,
    accessToken: null,
    login: (user, accessToken) => set({ user, accessToken }),
    logout: () => set({ user: null, accessToken: null }),
    setAccessToken: (token) => set({ accessToken: token, user: null }),
}));

export default useUserStore; 