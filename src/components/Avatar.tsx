import React from "react";
import classNames from "classnames";
import { ExtendedUserProfile } from "@/types/auth0";

interface AvatarProps {
    user: ExtendedUserProfile;
    className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ user, className ="" }) => {
  const getInitials = (firstName?: string, lastName?: string) => {
    const name = `${firstName} ${lastName}`;
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const isDefaultAvatar = (url?: string) => {
    return url?.includes("avatar/athlete/large.png");
  };

  return (
    <div className={classNames("mask mask-squircle shadow-lg overflow-hidden flex items-center justify-center bg-gray-200", className)}>
      {user?.picture && !isDefaultAvatar(user.picture) ? (
        <img
          src={user.picture}
          alt="Profile"
          className="w-full h-full object-cover object-top"
        />
      ) : (
        <span className="text-1xl font-extrabold text-gray-500">
          {getInitials(user?.given_name, user?.family_name)}
        </span>
      )}
    </div>
  );
};

export default Avatar;