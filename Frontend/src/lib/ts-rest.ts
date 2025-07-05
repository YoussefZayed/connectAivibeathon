import { initQueryClient } from '@ts-rest/react-query';
import { contract } from '@contract';
import { Platform } from 'react-native';
import { API_URL, DEV_API_URL } from '@env';
import useUserStore from '../store/user-store';
import axios from 'axios';
import { ClientInferRequest, ClientInferResponseBody } from '@ts-rest/core';

export const getBaseUrl = () => {
    // In development, we prioritize the DEV_API_URL from the .env file.
    if (__DEV__) {
        if (DEV_API_URL) {
            return DEV_API_URL;
        }

        // If DEV_API_URL is not set, we fall back to platform-specific defaults.
        if (Platform.OS === 'web') {
            // For web development, your browser can access localhost directly.
            return 'http://localhost:3000';
        }

        // For native development (Android Emulator), use the special IP that points to the host machine.
        // For physical devices on the same Wi-Fi, you would use your computer's network IP.
        return 'http://10.0.2.2:3000';
    }

    // In production, we use the mandatory API_URL from the .env file.
    return API_URL;
};

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
    const { accessToken } = useUserStore.getState();
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

const fetcher = async (
    input: RequestInfo | URL,
    init?: RequestInit,
): Promise<{
    status: number;
    body: any;
    headers: Headers;
}> => {
    try {
        const result = await axiosInstance.request({
            url: input.toString(),
            method: init?.method,
            data: init?.body,
            headers: init?.headers as any,
        });

        return {
            status: result.status,
            body: result.data,
            headers: result.headers as any,
        };
    } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
            return {
                status: e.response.status,
                body: e.response.data,
                headers: e.response.headers as any,
            };
        }
        throw e;
    }
};

export const client = initQueryClient(contract, {
    baseUrl: getBaseUrl(),
    baseHeaders: {},
    fetcher: fetcher,
}); 