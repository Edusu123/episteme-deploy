import ParticleRing from '@/components/ui/custom/points-background/points-backgrount';
import { ReactNode } from 'react';

export default async function layout({ children }: { children: ReactNode }) {
  return <ParticleRing>{children}</ParticleRing>;
}
