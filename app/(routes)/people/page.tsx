'use client';

import { PeopleTable } from '@/components/people/people-table';
import { mockPeople } from 'app/api/seed/mocks';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IResearch } from 'types/research';
import { IUser } from 'types/user';

const peoplePerPage = 5;

export default function page() {
  const searchParams = useSearchParams();

  const [people, setPeople] = useState<IUser[]>([]);

  const offset = Number(searchParams.get('offset') ?? peoplePerPage);

  const getAllPeople = async () => {
    setPeople(
      mockPeople.map(
        (mock: any): IUser => ({
          id: mock.id,
          name: mock.name,
          email: mock.email,
          profilePic: mock.profilePic,
          mutualResearches: mock.mutualResearches.map(
            (mockResearch: any): IResearch => ({
              researchId: mockResearch.id,
              imageUrl: mockResearch.imageUrl,
              title: mockResearch.title,
              isOwner: mockResearch.isOwner
            })
          ),
          createdAt: mock.createdAt
        })
      )
    );
  };

  useEffect(() => {
    getAllPeople();
  }, []);

  return (
    <PeopleTable
      offset={offset}
      people={people.slice(offset - peoplePerPage, offset)}
      peoplePerPage={peoplePerPage}
      total={people.length}
    />
  );
}
