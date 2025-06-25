'use client';

import { PeopleTable } from '@/components/people/people-table';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getPeople } from 'services/research';
import { IResearch } from 'types/research';
import { IUser } from 'types/user';
import { useQuery } from '@tanstack/react-query';
import { useCurrentUser } from '../../../hooks/useCurrentUser';

const peoplePerPage = 5;

export default function page() {
  const searchParams = useSearchParams();

  const [people, setPeople] = useState<IUser[]>([]);

  const offset = Number(searchParams.get('offset') ?? peoplePerPage);

  const { data: currentUser } = useCurrentUser();

  const {
    data: peopleData,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ['researchesPeople'],
    queryFn: getPeople
  });

  const formatPeopleData = async () => {
    if (peopleData?.data?.researchesUsers) {
      const formattedPeople = peopleData.data.researchesUsers.map(
        (user: any): IUser => ({
          id: user.userId,
          name: user.name,
          email: user.email,
          profilePic: user.fileUrl,
          mutualResearches:
            user.mutualResearches?.map(
              (research: any): IResearch => ({
                researchId: research.researchId,
                imageUrl: research.fileUrl,
                title: research.title,
                isOwner: research.ownerId === currentUser?.userId
              })
            ) || [],
          createdAt: new Date(user.createdAt)
        })
      );
      setPeople(formattedPeople);
    }
  };

  useEffect(() => {
    if (peopleData) {
      formatPeopleData();
    }
  }, [peopleData]);

  if (isFetching) return <div>Loading...</div>;
  return (
    <PeopleTable
      offset={offset}
      people={people.slice(offset - peoplePerPage, offset)}
      peoplePerPage={peoplePerPage}
      total={people.length}
      refetch={refetch}
    />
  );
}
