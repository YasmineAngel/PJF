// components/UserButtonWrapper.tsx
"use client";

import { UserButton } from "@clerk/nextjs";

const UserButtonWrapper = () => {
  return <UserButton afterSignOutUrl="/" />;
};

export default UserButtonWrapper;
