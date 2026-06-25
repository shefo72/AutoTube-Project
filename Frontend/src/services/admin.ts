import api from "./api";

// stats
export const getDashboardStats = async () => {
  const res = await api.get("/admin/dashboard/stats");
  return res.data.data;
};

// users
export const getAdminUsers = async () => {
  const res = await api.get("/admin/dashboard/users");
  return res.data;
};

//user details
export const getAdminUserById = async (id: number) => {
  const res = await api.get(`/admin/dashboard/users/${id}`);
  return res.data.data;
};

//edit
export const updateUserStatus = async (id: number, status: string) => {
  const res = await api.put(`/admin/dashboard/users/${id}/status`, {
    status: status,
  });
  return res.data;
};

//delete user
export const deleteUser = async (id: number) => {
  const res = await api.delete(`/admin/dashboard/users/${id}`);
  return res.data;
};
