import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { endpoint } from '@/api/market/endpoint';
import { UserRoundIcon } from 'lucide-react';
import React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

export type UserAvatarProps = React.ComponentPropsWithoutRef<
  typeof AvatarPrimitive.Root
> & {
  userId: string;
};

export const UserAvatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  UserAvatarProps
>(({ userId, ...props }, ref) => {
  return (
    <Avatar {...props} ref={ref}>
      <AvatarImage
        src={endpoint(`/v1/user/${userId}/avatar`)}
        className={props.className}
        alt="Avatar Image"
      />
      <AvatarFallback>
        <UserRoundIcon />
      </AvatarFallback>
    </Avatar>
  );
});

UserAvatar.displayName = 'UserAvatar';
