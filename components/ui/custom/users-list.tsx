'use server';

import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';
import Image from 'next/image';

interface ProfileInfo {
  profilePic: string;
  name: string;
}

interface IProps {
  usersList: ProfileInfo[];
}

export default async function UsersList({ usersList }: IProps) {
  return (
    <div>
      {usersList.map((x: ProfileInfo) => {
        return (
          <div className="hover:text-foreground" key={x.name}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Image
                  loader={() => x.profilePic}
                  className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800"
                  src={x.profilePic}
                  alt=""
                  width="64"
                  height="64"
                />
              </TooltipTrigger>
              <TooltipContent side="left">{x.name}</TooltipContent>
            </Tooltip>
            {/* <span className="sr-only">{x.name}</span> */}
          </div>
        );
      })}
    </div>
  );
}
