"use client";

import { useGetProfileQuery } from "@/services/profileApi";
import {
  useGetUsageQuery,
  useGetSubscriptionQuery,
} from "@/services/billingApi";
import { useGetChannelIdQuery } from "@/services/youtubeChannel";
import { useAppSelector } from "@/store/index";

export function GlobalDataLoader() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  useGetProfileQuery(undefined, { skip: !isAuthenticated });
  useGetUsageQuery(undefined, { skip: !isAuthenticated });
  useGetSubscriptionQuery(undefined, { skip: !isAuthenticated });
  useGetChannelIdQuery(undefined, { skip: !isAuthenticated });

  return null;
}
