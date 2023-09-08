import React, { useState } from "react";

export const RepliesManager = () => {
  const [userSuggetions, setUserSuggetions] = useState<any[]>([]);
  const [mentions, setMentions] = useState<any[]>([]);
  const [userSuggetionsPagination, setUserSuggetionsPagination] =
    useState<PageDataState>({
      page: 1,
      totalRecords: 0,
    });
  return <></>;
};
