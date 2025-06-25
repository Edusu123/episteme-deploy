'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip';
import Image from 'next/image';

interface ProfileInfo {
  userId: string;
  profilePic: string;
  name: string;
}

interface IProps {
  usersList: ProfileInfo[];
}

export default function UsersList({ usersList }: IProps) {
  return (
    <div className="flex -space-x-2 rtl:space-x-reverse">
      {usersList.map((x: ProfileInfo) => {
        return (
          <div className="hover:text-foreground" key={x.userId}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Image
                  loader={() => x.profilePic}
                  className="w-10 h-10 border-2 border-white object-contain rounded-full dark:border-gray-800"
                  src={x.profilePic}
                  alt=""
                  width="64"
                  height="64"
                  unoptimized={true}
                />
              </TooltipTrigger>
              <TooltipContent side="left">{x.name}</TooltipContent>
            </Tooltip>
          </div>
        );
      })}
    </div>
  );
}
