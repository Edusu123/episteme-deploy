'use client';

interface IProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: IProps) {
  return <div>{children}</div>;
}
