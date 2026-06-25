"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setIsMobileOpen } from "@/store/sidebarSlice";

export function useSidebar() {
  const dispatch = useDispatch();
  const isMobileOpen = useSelector(
    (state: RootState) => state.sidebar.isMobileOpen
  );

  return {
    isMobileOpen,
    setIsMobileOpen: (isOpen: boolean) => dispatch(setIsMobileOpen(isOpen)),
  };
}
