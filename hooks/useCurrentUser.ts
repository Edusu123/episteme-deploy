import { useQuery } from '@tanstack/react-query';
import { me } from 'services/user';

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async (): Promise<any> => {
      // TODO: Types API responses with zod
      const response = await me();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (anteriormente cacheTime)
    retry: 1,
    refetchOnWindowFocus: false,
  });
}; 