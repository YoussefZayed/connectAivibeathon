import { client } from '../lib/ts-rest';
import useUserStore from '../store/user-store';
import { useQuery } from '@tanstack/react-query';

export const useHealthCheckQuery = () => {
    return client.healthCheck.useQuery(['healthCheck']);
};

export const useLoginMutation = () => {
    return client.login.useMutation();
};

export const useRegisterMutation = () => {
    return client.register.useMutation();
};

export const useMeQuery = () => {
    const accessToken = useUserStore((s) => s.accessToken);

    return useQuery({
        queryKey: ['me', accessToken],
        queryFn: async () => {
            if (!accessToken) return null;

            const result = await client.me.query({
                headers: {
                    authorization: `Bearer ${accessToken}`,
                },
            });

            if (result.status === 200) {
                return result;
            }

            throw result;
        },
        enabled: !!accessToken,
        retry: 1,
    });
};
