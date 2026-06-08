"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  getUserById,
  v59Notifications,
  v59Users,
  type V59AccountSettings,
  type V59EnterpriseUser,
  type V59Notification,
  type V59PresenceStatus
} from "@/lib/enterprise/work-os-enterprise-accounts";

type V59AccountStore = {
  currentUserId: string;
  users: V59EnterpriseUser[];
  notifications: V59Notification[];
  setCurrentUser: (userId: string) => void;
  logoutDemo: () => void;
  updatePresence: (userId: string, presenceStatus: V59PresenceStatus) => void;
  updateSettings: (userId: string, patch: Partial<V59AccountSettings>) => void;
  updateAvatar: (userId: string, avatarUrl: string) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: (userId: string) => void;
  inviteUserMock: (email: string, name: string) => void;
};

function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useV59AccountStore = create<V59AccountStore>()(
  persist(
    (set, get) => ({
      currentUserId: "u1",
      users: v59Users,
      notifications: v59Notifications,
      setCurrentUser: (userId) => set({ currentUserId: getUserById(userId) ? userId : "u1" }),
      logoutDemo: () => set({ currentUserId: "u1" }),
      updatePresence: (userId, presenceStatus) => set({ users: get().users.map((user) => user.id === userId ? { ...user, presenceStatus, updatedAt: new Date().toISOString() } : user) }),
      updateSettings: (userId, patch) => set({ users: get().users.map((user) => user.id === userId ? { ...user, settings: { ...user.settings, ...patch }, updatedAt: new Date().toISOString() } : user) }),
      updateAvatar: (userId, avatarUrl) => set({ users: get().users.map((user) => user.id === userId ? { ...user, avatarUrl, updatedAt: new Date().toISOString() } : user) }),
      markNotificationRead: (notificationId) => set({ notifications: get().notifications.map((notification) => notification.id === notificationId ? { ...notification, read: true } : notification) }),
      markAllNotificationsRead: (userId) => set({ notifications: get().notifications.map((notification) => notification.userId === userId ? { ...notification, read: true } : notification) }),
      inviteUserMock: (email, name) => set({
        users: [
          ...get().users,
          {
            ...v59Users[9],
            id: makeId("user"),
            email,
            name,
            username: email.split("@")[0] ?? name.toLowerCase().replace(/ /g, "."),
            initials: name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
            avatar: name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
            status: "invited",
            active: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]
      })
    }),
    { name: "servelect-work-os-v59-account-store", version: 59 }
  )
);
