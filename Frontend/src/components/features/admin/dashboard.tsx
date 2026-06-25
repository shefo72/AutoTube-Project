"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  UserStatus,
  DashboardStats,
  UserDetails,
  UserData,
} from "@/types/adminDashboard";
import {
  getDashboardStats,
  getAdminUsers,
  getAdminUserById,
  updateUserStatus,
  deleteUser,
} from "@/services/admin";
import AdminDashboardHeader from "@/components/layout/AdminDashboardHeader";

import { KPIs } from "./KPIs";
import { UserManagementTable } from "./UserManagementTable";
import { UserDetailsModal } from "./UserDetailsModal";
import { ChangeStatusModal } from "./ChangeStatusModal";
import AdminDashboardSkeleton from "./AdminDashboardSkeleton";
import { DeleteUserModal } from "./DeleteUserModel";

export default function AdminDashboard() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<UserData[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(
    null
  );
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [showChangeStatus, setShowChangeStatus] = useState<
    UserData | UserDetails | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingUser, setLoadingUser] = useState(false);

  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [usersRes, statsRes] = await Promise.all([
          getAdminUsers(),
          getDashboardStats(),
        ]);

        const usersData = usersRes.data || [];
        const mappedUsers: UserData[] = usersData.map((u: UserData) => ({
          id: u.id,
          name: u.fullName || u.name,
          email: u.email,
          plan: u.plan || "None",
          status: u.status,
          analyses: u.analyses || 0,
          videos: u.videos || 0,
          revenue: u.revenue || "$0",
          joined: "N/A",
          performance: [],
        }));

        setUsers(mappedUsers);
        setDashboardData(statsRes);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleOpenUserModal = async (id: number) => {
    try {
      setIsModalOpen(true);
      setLoadingUser(true);
      const res = await getAdminUserById(id);

      setUserDetails({
        ...res,
        status: res.status?.toLowerCase() === "active" ? "Active" : "Inactive",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load user details");
      setIsModalOpen(false);
    } finally {
      setLoadingUser(false);
    }
  };

  const handleStatusChange = async (id: number, status: UserStatus) => {
    try {
      await updateUserStatus(id, status);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
      toast.success("Status updated successfully!");
      setShowChangeStatus(null);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return false;

    setIsDeletingUser(true);
    try {
      await deleteUser(userToDelete.id);

      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setUserToDelete(null);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setIsDeletingUser(false);
    }
  };

  if (loading) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div className="bg-background h-full w-full overflow-y-auto pb-24">
      <AdminDashboardHeader />
      <div className="space-y-5 p-5 md:p-8">
        <KPIs data={dashboardData} />

        <UserManagementTable
          users={users}
          search={search}
          onSearchChange={setSearch}
          onViewUser={handleOpenUserModal}
          onChangeStatus={setShowChangeStatus}
          onDeleteUserClick={setUserToDelete}
        />
      </div>

      <UserDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        loading={loadingUser}
        user={userDetails}
        onChangeStatusClick={(user) => {
          setIsModalOpen(false);
          setShowChangeStatus(user);
        }}
      />

      <ChangeStatusModal
        user={showChangeStatus}
        onClose={() => setShowChangeStatus(null)}
        onStatusChange={handleStatusChange}
      />

      {userToDelete && (
        <DeleteUserModal
          isOpen={!!userToDelete}
          onClose={() => setUserToDelete(null)}
          onDelete={handleDeleteUser}
          isDeleting={isDeletingUser}
          userEmail={userToDelete.email}
        />
      )}
    </div>
  );
}
