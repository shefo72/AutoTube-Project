import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SidebarState {
  isMobileOpen: boolean;
}

const initialState: SidebarState = {
  isMobileOpen: false,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setIsMobileOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileOpen = action.payload;
    },
  },
});

export const { setIsMobileOpen } = sidebarSlice.actions;
export default sidebarSlice.reducer;
