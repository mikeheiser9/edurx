import { getStaticImageUrl } from "@/util/helpers";
import { faUserAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useState } from "react";

interface CommentData {
  content: string;
  taggedUsers: any[];
}
// Custom UserCard component
const UserCard = ({ user }: { user: UserId }) => {
  return (
    <div className="relative inline-block z-10">
      <div className="absolute border-white/30 border w-max rounded-md bg-gray-700 p-2 animate-fade-in-down mt-1 right-0">
        <span className="absolute w-2 right-[50%] h-2 -top-1 z-30 rounded-sm bg-gray-700 block rotate-45 border-white/30 border-l border-t" />
        <div className="flex gap-2 items-center flex-auto">
          <span className="flex cursor-pointer border-primary overflow-hidden w-12 h-12 justify-center items-center text-primary rounded-full bg-white">
            {user.profile_img ? (
              <img
                src={getStaticImageUrl(user.profile_img)}
                alt={user.username}
              />
            ) : (
              <FontAwesomeIcon icon={faUserAlt} />
            )}
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-bold capitalize text-primary">
              {user?.role}
            </span>
            <span className="text-sm capitalize">
              {user.first_name} {user.last_name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserLink = ({ user }: { user: UserId }) => {
  const [showUserCard, setShowUserCard] = useState<boolean>(false);
  return (
    <div
      onMouseEnter={() => setShowUserCard(true)}
      onMouseLeave={() => setShowUserCard(false)}
      className="inline-block"
    >
      <Link
        title={`View Profile of ${user.username}`}
        href={`/profile/${user._id}`}
        className="text-blue-600"
      >
        @{user.username}
        {user && showUserCard && <UserCard user={user} />}
      </Link>
    </div>
  );
};

// Utility function to replace tagged users with UserCard components
const replaceTaggedUsers = ({ content, taggedUsers = [] }: CommentData) => {
  const userMentions = taggedUsers.map((user) => `@${user.username}`);

  const splitContent = content.split(
    new RegExp(`(${userMentions.join("|")})`, "g")
  );

  const updatedContent = splitContent.map((part, index) => {
    if (userMentions.includes(part)) {
      const user = taggedUsers.find(
        (taggedUser) => `@${taggedUser.username}` === part
      );
      return <UserLink key={index} user={user} />;
    }
    return part;
  });

  return <>{updatedContent}</>;
};

export default replaceTaggedUsers;
