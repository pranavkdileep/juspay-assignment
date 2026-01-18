"use client";

import Image from "next/image";

import { useTheme } from "../theme/ThemeProvider";
import styles from "./Sidebar.module.css";
import { SIDEBAR_SECTIONS, SIDEBAR_USER, type SidebarLink } from "./sidebarConfig";

function SidebarLinkRow({ link }: { link: SidebarLink }) {
	const { theme } = useTheme();
	return (
		<div>
			<a
				className={`${styles.item} ${link.active ? styles.itemActive : ""}`}
				href={link.href}
			>
				{link.active && <div className={styles.indicator} />}
				{link.iconSrc ? (
					<Image
						className={styles.icon}
						src={`/assests/${theme}/${link.iconSrc}`}
						alt=""
						width={16}
						height={16}
					/>
				) : null}
				<div className={styles.labelRow}>
					<span className={styles.label}>{link.label}</span>
					{link.pillText ? <span className={styles.pill}>{link.pillText}</span> : null}
				</div>
			</a>

			{link.children?.length ? (
				<div className={styles.children}>
					{link.children.map((child) => (
						<a
							key={child.label}
							className={styles.childItem}
							href={child.href}
							aria-current={child.active ? "page" : undefined}
						>
							{child.label}
						</a>
					))}
				</div>
			) : null}
		</div>
	);
}

export default function Sidebar({ collapsed = false }: { collapsed?: boolean }) {
	const { theme } = useTheme();
	return (
		<aside
			className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}
			aria-label="Sidebar"
			aria-hidden={collapsed}
		>
			<div className={styles.header}>
				<div className={styles.avatar}>
					<Image
						src={`/${SIDEBAR_USER.avatarSrc}`}
						alt=""
						width={32}
						height={32}
						priority
					/>
				</div>
				<div className={styles.brand}>
					<div className={styles.brandName}>{SIDEBAR_USER.name}</div>
				</div>
			</div>

			<div className={styles.tabs} aria-label="Sidebar tabs">
				<button type="button" className={`${styles.tab} ${styles.tabActive}`}>
					Favorites
				</button>
				<button type="button" className={styles.tab}>
					Recently
				</button>
			</div>

			{SIDEBAR_SECTIONS.map((section) => (
				<section key={section.title} className={styles.section}>
					<div className={styles.sectionTitle}>{section.title}</div>
					<nav className={styles.list} aria-label={section.title}>
						{section.links.map((link) => (
							<SidebarLinkRow key={link.label} link={link} />
						))}
					</nav>
				</section>
			))}
		</aside>
	);
}
