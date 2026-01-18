"use client";

import Image from "next/image";

import { useTheme } from "../theme/ThemeProvider";
import styles from "./SidebarRight.module.css";
import {
  RIGHTBAR_ACTIVITIES,
  RIGHTBAR_CONTACTS,
  RIGHTBAR_NOTIFICATIONS,
  type ActivityItem,
  type ContactItem,
  type NotificationItem,
} from "./rightbarConfig";

function NotificationRow({ item }: { item: NotificationItem }) {
  const { theme } = useTheme();
  return (
    <div className={styles.notification}>
      <div className={styles.notifIconWrap}>
        <Image src={`/assests/${theme}/${item.iconSrc}`} alt="" width={18} height={18} />
      </div>
      <div className={styles.notifText}>
        <div className={styles.primary}>{item.title}</div>
        <div className={styles.secondary}>{item.time}</div>
      </div>
    </div>
  );
}

function ActivityRow({ item }: { item: ActivityItem }) {
  const { theme } = useTheme();
  return (
    <div className={styles.activity}>
      <div className={styles.avatarWrap}>
        <Image src={`/assests/${theme}/${item.avatarSrc}`} alt="" width={36} height={36} />
      </div>
      <div className={styles.timeline}>
        <div className={styles.timelineLine} />
        <div className={styles.primary}>{item.title}</div>
        <div className={styles.secondary}>{item.time}</div>
      </div>
    </div>
  );
}

function ContactRow({ item }: { item: ContactItem }) {
  const { theme } = useTheme();
  return (
    <div className={styles.contact}>
      <div className={styles.avatarWrap}>
        <Image src={`/assests/${theme}/${item.avatarSrc}`} alt="" width={36} height={36} />
      </div>
      <div className={styles.contactName}>{item.name}</div>
    </div>
  );
}

export default function SidebarRight({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <aside
      className={`${styles.rightbar} ${collapsed ? styles.collapsed : ""}`}
      aria-label="Right sidebar"
      aria-hidden={collapsed}
    >
      <section className={styles.section}>
        <div className={styles.title}>Notifications</div>
        <div className={styles.list}>
          {RIGHTBAR_NOTIFICATIONS.map((item, idx) => (
            <NotificationRow key={`${item.title}-${idx}`} item={item} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.title}>Activities</div>
        <div className={styles.list}>
          {RIGHTBAR_ACTIVITIES.map((item, idx) => (
            <ActivityRow key={`${item.title}-${idx}`} item={item} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.title}>Contacts</div>
        <div className={styles.list}>
          {RIGHTBAR_CONTACTS.map((item) => (
            <ContactRow key={item.name} item={item} />
          ))}
        </div>
      </section>
    </aside>
  );
}
