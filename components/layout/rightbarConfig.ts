export type NotificationItem = {
  iconSrc: string;
  title: string;
  time: string;
};

export type ActivityItem = {
  avatarSrc: string;
  title: string;
  time: string;
};

export type ContactItem = {
  avatarSrc: string;
  name: string;
};

export const RIGHTBAR_NOTIFICATIONS: NotificationItem[] = [
  {
    iconSrc: "notification/bug.svg",
    title: "You have a bug that needs...",
    time: "Just now",
  },
  {
    iconSrc: "notification/newuser.svg",
    title: "New user registered",
    time: "59 minutes ago",
  },
  {
    iconSrc: "notification/bug.svg",
    title: "You have a bug that needs...",
    time: "12 hours ago",
  },
  {
    iconSrc: "notification/connections.svg",
    title: "Andi Lane subscribed to you",
    time: "Today, 11:59 AM",
  },
];

export const RIGHTBAR_ACTIVITIES: ActivityItem[] = [
  {
    avatarSrc: "activities/user1.svg",
    title: "You have a bug that needs...",
    time: "Just now",
  },
  {
    avatarSrc: "activities/user2.svg",
    title: "Released a new version",
    time: "59 minutes ago",
  },
  {
    avatarSrc: "activities/user3.svg",
    title: "Submitted a bug",
    time: "12 hours ago",
  },
  {
    avatarSrc: "activities/user4.svg",
    title: "Modified A data in Page X",
    time: "Today, 11:59 AM",
  },
  {
    avatarSrc: "activities/user5.svg",
    title: "Deleted a page in Project X",
    time: "Feb 2, 2023",
  },
];

export const RIGHTBAR_CONTACTS: ContactItem[] = [
  { avatarSrc: "contacts/user1.svg", name: "Natali Craig" },
  { avatarSrc: "contacts/user2.svg", name: "Drew Cano" },
  { avatarSrc: "contacts/user3.svg", name: "Orlando Diggs" },
  { avatarSrc: "contacts/user4.svg", name: "Andi Lane" },
  { avatarSrc: "contacts/user5.svg", name: "Kate Morrison" },
  { avatarSrc: "contacts/user6.svg", name: "Koray Okumus" },
];
