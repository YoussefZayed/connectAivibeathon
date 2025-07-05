import { client } from '../lib/ts-rest';
import useUserStore from '../store/user-store';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export const useHealthCheckQuery = () => {
    return client.healthCheck.useQuery(['healthCheck']);
};

export const useLoginMutation = () => {
    return client.login.useMutation();
};

export const useRegisterMutation = () => {
    return client.register.useMutation();
};

type MeQueryResult = Awaited<ReturnType<typeof client.me.query>>;

export const useMeQuery = (
  options?: Omit<
    UseQueryOptions<
      MeQueryResult,
      unknown,
      MeQueryResult,
      [string, string | null]
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  const accessToken = useUserStore(s => s.accessToken);

  return useQuery({
    queryKey: ['me', accessToken],
    queryFn: async () => {
      if (!accessToken) {
        // This should not happen because the query is disabled if there is no token
        // but as a safeguard:
        throw new Error('No access token');
      }

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
    ...options,
  });
};

export const useAddContactMutation = () => {
  return client.addContact.useMutation();
};

export const useGetContactsQuery = () => {
  const accessToken = useUserStore(s => s.accessToken);

  return useQuery({
    queryKey: ['contacts', accessToken],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error('No access token');
      }

      const result = await client.getContacts.query({
        extraHeaders: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      if (result.status === 200) {
        return result;
      }

      throw result;
    },
    enabled: !!accessToken,
  });
};

export const useCreateProfileMutation = () => {
  return client.createProfile.useMutation();
};

export const useGetProfileQuery = () => {
  const accessToken = useUserStore(s => s.accessToken);

  return useQuery({
    queryKey: ['profile', accessToken],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error('No access token');
      }

      const result = await client.getProfile.query({
        extraHeaders: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      if (result.status === 200) {
        return result;
      }

      throw result;
    },
    enabled: !!accessToken,
  });
};
