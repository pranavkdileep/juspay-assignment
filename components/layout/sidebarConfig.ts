export type SidebarLink = {
  label: string;
  href: string;
  iconSrc?: string;
  active?: boolean;
  pillText?: string;
  children?: Array<{ label: string; href: string; active?: boolean }>;
};

export type SidebarSection = {
  title: string;
  links: SidebarLink[];
};

export const SIDEBAR_USER = {
  name: "ByeWind",
  avatarSrc: "assests/byewind.svg",
};

export const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    title: "Favorites",
    links: [
      { label: "Overview", href: "#", iconSrc: "dash.svg" },
      { label: "Projects", href: "#", iconSrc: "projects.svg" },
    ],
  },
  {
    title: "Dashboards",
    links: [
      {
        label: "Default",
        href: "#",
        iconSrc: "default.svg",
        active: true,
      },
      { label: "eCommerce", href: "#", iconSrc: "ecommerce.svg" },
      { label: "Projects", href: "#", iconSrc: "projects.svg" },
      { label: "Online Courses", href: "#", iconSrc: "onlinecource.svg" },
    ],
  },
  {
    title: "Pages",
    links: [
      {
        label: "User Profile",
        href: "#",
        iconSrc: "userprofile.svg",
        children: [
          { label: "Overview", href: "#", active: true },
          { label: "Projects", href: "#" },
          { label: "Campaigns", href: "#" },
          { label: "Documents", href: "#" },
          { label: "Followers", href: "#" },
        ],
      },
      { label: "Account", href: "#", iconSrc: "account.svg" },
      { label: "Corporate", href: "#", iconSrc: "corporates.svg" },
      { label: "Blog", href: "#", iconSrc: "blog.svg" },
      { label: "Social", href: "#", iconSrc: "social.svg" },
    ],
  },
];
