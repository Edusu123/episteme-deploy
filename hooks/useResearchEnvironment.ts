import { useQuery } from '@tanstack/react-query';
import { getResearchEnvironment } from 'services/research';

export const useResearchEnvironment = ({
  researchId
}: {
  researchId: string;
}) => {
  return useQuery({
    queryKey: ['research-environment', researchId],
    queryFn: () => getResearchEnvironment({ researchId })
  });
};
