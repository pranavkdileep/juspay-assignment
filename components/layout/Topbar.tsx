"use client";

import Image from "next/image";

import { useTheme } from "../theme/ThemeProvider";
import { RIGHTBAR_WIDTH, SIDEBAR_WIDTH, TOPBAR_HEIGHT } from "./layoutConstants";
import styles from "./Topbar.module.css";

type IconButtonProps = {
	iconSrc: string;
	label: string;
	onClick?: () => void;
};

function IconButton({ iconSrc, label, onClick }: IconButtonProps) {
	return (
		<button type="button" className={styles.iconBtn} onClick={onClick} aria-label={label}>
			<Image className={styles.icon} src={iconSrc} alt="" width={20} height={20} />
		</button>
	);
}


type TopbarProps = {
	leftOffset?: number;
	rightOffset?: number;
	height?: number;
	onToggleLeftSidebar?: () => void;
	onToggleRightSidebar?: () => void;
};

export default function Topbar({
	leftOffset = SIDEBAR_WIDTH,
	rightOffset = RIGHTBAR_WIDTH,
	height = TOPBAR_HEIGHT,
	onToggleLeftSidebar,
	onToggleRightSidebar,
}: TopbarProps) {
	const { theme, toggleTheme } = useTheme();

	return (
		<header
			className={styles.topbar}
			style={{ left: leftOffset, right: rightOffset, height }}
			aria-label="Top navigation"
		>
			<div className={styles.inner}>
				<div className={styles.left}>
					<IconButton iconSrc={`/assests/${theme}/dash.svg`} label="Menu" onClick={onToggleLeftSidebar} />
					<IconButton iconSrc={`/assests/${theme}/star.svg`} label="Star" />
					<div className={styles.breadcrumb}>
						<span className={styles.crumbMuted}>Dashboards</span>
						<span className={styles.slash}>/</span>
						<span>Default</span>
					</div>
				</div>

				<div className={styles.right}>
					<div className={styles.search}>
						<Image
							className={styles.searchIcon}
							src="/search.svg"
							alt=""
							width={16}
							height={16}
						/>
						<input className={styles.searchInput} placeholder="Search" aria-label="Search" />
						<span className={styles.kbd}>⌘/</span>
					</div>
					<IconButton iconSrc={`/assests/${theme}/sun.svg`} label="Toggle dark theme" onClick={toggleTheme} />
					<IconButton iconSrc={`/assests/${theme}/history.svg`} label="History" />
					<IconButton iconSrc={`/assests/${theme}/bell.svg`} label="Notifications" />
					<IconButton iconSrc={`/assests/${theme}/dash.svg`} label="Apps" onClick={onToggleRightSidebar} />
				</div>
			</div>
		</header>
	);
}
