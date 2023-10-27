import { getStaticImageUrl } from "@/util/helpers";
import { faUserAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useState } from "react";

interface CommentData {
  content: string;
  taggedUsers: UserId[];
  showCard?: boolean;
}
// Custom UserCard component
const UserCard = ({ user }: { user: UserId }) => {
  return (
    <div className="relative inline-block z-10">
      <div className="absolute w-max rounded-md bg-eduLightBlue p-2 animate-fade-in-down mt-1 right-0">
        <span className="absolute w-2 right-[50%] h-2 -top-1 z-30 rounded-sm bg-eduLightBlue block rotate-45 border-l border-t" />
        <div className="flex gap-2 items-center flex-auto">
          <span className="flex cursor-pointer p-[2px] border-primary overflow-hidden w-12 h-12 justify-center items-center text-primary rounded-full bg-white">
            {user.profile_img ? (
              <img
                src={getStaticImageUrl(user.profile_img)}
                alt={user.username}
                className="rounded-full"
              />
            ) : (
              <FontAwesomeIcon icon={faUserAlt} />
            )}
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-bold capitalize text-primary">
              {user?.role}
            </span>
            <span className="text-sm text-white capitalize">
              {user.first_name} {user.last_name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserLink = ({ user, showCard }: { user: UserId; showCard: boolean }) => {
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
        className="text-eduLightBlue"
      >
        @{user.username}
        {user && showCard && showUserCard && <UserCard user={user} />}
      </Link>
    </div>
  );
};

// Utility function to replace tagged users with UserCard components
const replaceTaggedUsers = ({
  content,
  taggedUsers = [],
  showCard = true,
}: CommentData) => {
  const userMentions = taggedUsers.map((user) => `@${user.username}`);

  const splitContent = content.split(
    new RegExp(`(${userMentions.join("|")})`, "g")
  );

  const updatedContent = splitContent.map((part, index) => {
    if (userMentions.includes(part)) {
      const user = taggedUsers.find(
        (taggedUser) => `@${taggedUser.username}` === part
      );
      return user && <UserLink showCard={showCard} key={index} user={user} />;
    }
    return part;
  });

  return <>{updatedContent}</>;
};

export default replaceTaggedUsers;
