"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import styles from "./CenterOrderList.module.css";
import type { OrdersResult, OrderStatus } from "../../app/orders/actions";

const STATUSES: Array<{ label: string; value: OrderStatus | "all" }> = [
	{ label: "All Status", value: "all" },
	{ label: "In Progress", value: "In Progress" },
	{ label: "Complete", value: "Complete" },
	{ label: "Pending", value: "Pending" },
	{ label: "Approved", value: "Approved" },
	{ label: "Rejected", value: "Rejected" },
];

const SORT_CYCLE: Array<{ sort: "date" | "user" | "project" | "status"; dir: "asc" | "desc" }> = [
	{ sort: "date", dir: "desc" },
	{ sort: "date", dir: "asc" },
	{ sort: "user", dir: "asc" },
	{ sort: "user", dir: "desc" },
	{ sort: "project", dir: "asc" },
	{ sort: "project", dir: "desc" },
];

function statusStyle(status: string): { dot: string; text: string } {
	switch (status) {
		case "In Progress":
			return { dot: "#95A4FC", text: "#8A8CD9" };
		case "Complete":
			return { dot: "#A1E3CB", text: "#4AA785" };
		case "Pending":
			return { dot: "#B1E3FF", text: "#59A8D4" };
		case "Approved":
			return { dot: "#FFE999", text: "#FFC555" };
		case "Rejected":
		default:
			return { dot: "rgba(28, 28, 28, 0.4)", text: "rgba(28, 28, 28, 0.4)" };
 	}
}

function CalendarIcon() {
	return (
		<svg className={styles.icon16} viewBox="0 0 20 20" aria-hidden="true">
			<path
				d="M6.25 3.25c.414 0 .75.336.75.75V5h5V4a.75.75 0 1 1 1.5 0v1h.5c1.105 0 2 .895 2 2v8c0 1.105-.895 2-2 2h-9c-1.105 0-2-.895-2-2V7c0-1.105.895-2 2-2h.5V4c0-.414.336-.75.75-.75zM4.5 8.25V15c0 .276.224.5.5.5h9a.5.5 0 0 0 .5-.5V8.25h-10z"
				fill="currentColor"
			/>
		</svg>
	);
}

function AddIcon() {
	return (
		<svg className={styles.icon20} viewBox="0 0 20 20" aria-hidden="true">
			<path
				d="M10 4.25c.414 0 .75.336.75.75v4.25H15c.414 0 .75.336.75.75s-.336.75-.75.75h-4.25V15c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-4.25H5c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h4.25V5c0-.414.336-.75.75-.75z"
				fill="currentColor"
			/>
		</svg>
	);
}

function FilterIcon() {
	return (
		<svg className={styles.icon20} viewBox="0 0 20 20" aria-hidden="true">
			<path
				d="M3.25 5.5c0-.414.336-.75.75-.75h12c.414 0 .75.336.75.75 0 .18-.064.355-.18.492L12 12.398V15.25c0 .284-.16.544-.414.673l-2 .999A.75.75 0 0 1 8.5 16.25v-3.852L3.43 5.992A.75.75 0 0 1 3.25 5.5z"
				fill="currentColor"
			/>
		</svg>
	);
}

function SortIcon() {
	return (
		<svg className={styles.icon20} viewBox="0 0 20 20" aria-hidden="true">
			<path
				d="M6.25 3.5c.414 0 .75.336.75.75v10.19l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06L5.5 14.44V4.25c0-.414.336-.75.75-.75zm7.5 13c-.414 0-.75-.336-.75-.75V5.56l-1.72 1.72a.75.75 0 1 1-1.06-1.06l3-3a.75.75 0 0 1 1.06 0l3 3a.75.75 0 1 1-1.06 1.06L14.5 5.56v10.19c0 .414-.336.75-.75.75z"
				fill="currentColor"
			/>
		</svg>
	);
}

function ArrowLeftIcon() {
	return (
		<svg className={styles.icon20} viewBox="0 0 20 20" aria-hidden="true">
			<path
				d="M8.97 4.47a.75.75 0 0 1 0 1.06L5.56 8.94H16a.75.75 0 0 1 0 1.5H5.56l3.41 3.41a.75.75 0 1 1-1.06 1.06l-4.7-4.7a.75.75 0 0 1 0-1.06l4.7-4.7a.75.75 0 0 1 1.06 0z"
				fill="currentColor"
			/>
		</svg>
	);
}

function ArrowRightIcon() {
	return (
		<svg className={styles.icon20} viewBox="0 0 20 20" aria-hidden="true">
			<path
				d="M11.03 4.47a.75.75 0 0 1 1.06 0l4.7 4.7a.75.75 0 0 1 0 1.06l-4.7 4.7a.75.75 0 1 1-1.06-1.06l3.41-3.41H4a.75.75 0 0 1 0-1.5h10.44l-3.41-3.41a.75.75 0 0 1 0-1.06z"
				fill="currentColor"
			/>
		</svg>
	);
}

function DotsIcon() {
	return (
		<svg className={styles.icon16} viewBox="0 0 20 20" aria-hidden="true">
			<path
				d="M10 5.5a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm0 6.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm0 6.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"
				fill="currentColor"
			/>
		</svg>
	);
}

export default function CenterOrderList({ result }: { result: OrdersResult }) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	const [searchDraft, setSearchDraft] = useState(result.query.q);

	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const filterRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
				setIsFilterOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Keep draft in sync when user navigates with back/forward.
	useEffect(() => {
		setSearchDraft(result.query.q);
	}, [result.query.q]);

	const [selectedId, setSelectedId] = useState<string | null>(null);

	const currentSortIndex = useMemo(() => {
		return (
			SORT_CYCLE.findIndex((s) => s.sort === result.query.sort && s.dir === result.query.dir) || 0
		);
	}, [result.query.sort, result.query.dir]);

	function pushParams(next: Record<string, string | number | undefined>) {
		const params = new URLSearchParams(searchParams.toString());
		for (const [key, value] of Object.entries(next)) {
			if (value === undefined || value === "") {
				params.delete(key);
			} else {
				params.set(key, String(value));
			}
		}
		startTransition(() => {
			router.push(`${pathname}?${params.toString()}`);
		});
	}

	// Debounced searching
	useEffect(() => {
		const handle = window.setTimeout(() => {
			if (searchDraft === result.query.q) return;
			pushParams({ q: searchDraft, page: 1 });
		}, 350);
		return () => window.clearTimeout(handle);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchDraft]);

	const currentStatusIndex = useMemo(() => {
		return STATUSES.findIndex((s) => s.value === result.query.status);
	}, [result.query.status]);

	const pageWindow = useMemo(() => {
		const total = result.totalPages;
		const current = result.page;
		const maxButtons = 5;
		if (total <= maxButtons) {
			return Array.from({ length: total }, (_, i) => i + 1);
		}
		const start = Math.min(Math.max(1, current - 2), total - (maxButtons - 1));
		return Array.from({ length: maxButtons }, (_, i) => start + i);
	}, [result.page, result.totalPages]);

	return (
		<section className={styles.wrap}>
			<div className={styles.frame}>
				<h2 className={styles.title}>Order List</h2>
				<div className={styles.contentBar} aria-busy={isPending}>
					<div className={styles.group}>
						<button type="button" className={styles.iconBtn} aria-label="Add">
							<AddIcon />
						</button>
						<div className={styles.filterContainer} ref={filterRef}>
							<button
								type="button"
								className={styles.iconBtn}
								aria-label="Filter"
								style={{ background: isFilterOpen ? "var(--ol-surface-3)" : undefined }}
								onClick={() => setIsFilterOpen(!isFilterOpen)}
							>
								<FilterIcon />
							</button>
							{isFilterOpen && (
								<div className={styles.dropdown}>
									{STATUSES.map((status) => {
										const isActive = status.value === result.query.status;
										return (
											<button
												key={status.value}
												type="button"
												className={`${styles.dropdownItem} ${isActive ? styles.dropdownItemActive : ""}`}
												onClick={() => {
													pushParams({ status: status.value, page: 1 });
													setIsFilterOpen(false);
												}}
											>
												<span>{status.label}</span>
												{isActive && <span>✓</span>}
											</button>
										);
									})}
								</div>
							)}
						</div>
						<button
							type="button"
							className={styles.iconBtn}
							aria-label="Sort"
							onClick={() => {
								const next = SORT_CYCLE[(currentSortIndex + 1) % SORT_CYCLE.length]!;
								pushParams({ sort: next.sort, dir: next.dir, page: 1 });
							}}
						>
							<SortIcon />
						</button>
					</div>

					<div className={styles.search}>
						<Image
							className={styles.searchIcon}
							src="/search.svg"
							alt=""
							width={16}
							height={16}
						/>
						<input
							className={styles.searchInput}
							value={searchDraft}
							onChange={(e) => setSearchDraft(e.target.value)}
							placeholder="Search"
							aria-label="Search"
						/>
						<span className={styles.searchGhost} aria-hidden="true">
							.
						</span>
					</div>
				</div>

				<div className={styles.table}>
					<div className={styles.colCheckbox}>
						<div className={styles.cellCheckboxHeader}>
							<button
								type="button"
								className={styles.checkboxEmpty}
								aria-label="Select all"
								disabled
							/>
						</div>
						{Array.from({ length: 10 }).map((_, idx) => (
							<div
								key={idx}
								className={`${styles.cellCheckbox} ${result.items[idx]?.id === selectedId ? styles.cellSelected : ""}`}
							>
								<button
									type="button"
									className={
										result.items[idx]?.id === selectedId
											? styles.checkboxChecked
											: styles.checkboxEmpty
									}
									aria-label={
										result.items[idx]?.id
											? `Select ${result.items[idx]!.id}`
											: ""
									}
									onClick={(e) => {
										e.stopPropagation();
										const id = result.items[idx]?.id;
										if (!id) return;
										setSelectedId(id);
									}}
									disabled={!result.items[idx]?.id}
								/>
							</div>
						))}
					</div>

					<div className={styles.grid}>
						<div className={styles.row}>
							<div className={styles.th}>Order ID</div>
							<div className={styles.th}>User</div>
							<div className={styles.th}>Project</div>
							<div className={styles.th}>Address</div>
							<div className={styles.th}>Date</div>
							<div className={styles.th}>Status</div>
							<div className={styles.thActions} />
						</div>

						{Array.from({ length: 10 }).map((_, idx) => {
							const o = result.items[idx];
							const isSelected = o?.id && o.id === selectedId;
							const s = o ? statusStyle(o.status) : null;

							return (
								<div
									key={o?.id ?? `empty-${idx}`}
									className={`${styles.row} ${isSelected ? styles.rowSelected : ""}`}
									onClick={() => (o ? setSelectedId(o.id) : null)}
									role="row"
								>
									<div className={styles.td100}>{o?.id ?? ""}</div>
									<div className={styles.td214}>
										{o ? (
											<span className={styles.customerCell}>
												<Image
													className={styles.avatar}
													src={o.avatarSrc}
													alt=""
													width={24}
													height={24}
												/>
												<span>{o.user}</span>
											</span>
										) : null}
									</div>
									<div className={styles.td214}>{o?.project ?? ""}</div>
									<div className={styles.td270}>{o?.address ?? ""}</div>
									<div className={styles.td191}>
										{o ? (
											<span className={styles.dateCell}>
												<CalendarIcon />
												<span>{o.dateLabel}</span>
											</span>
										) : null}
									</div>
									<div className={styles.td110}>
										{o && s ? (
											<span className={styles.statusBadge}>
												<span className={styles.statusDot} style={{ background: s.dot }} />
												<span className={styles.statusText} style={{ color: s.text }}>
													{o.status}
												</span>
											</span>
										) : null}
									</div>
									<div className={styles.td48}>
										{o ? (
											<button
												type="button"
												className={styles.actionBtn}
												aria-label="Actions"
												onClick={(e) => {
													e.stopPropagation();
													setSelectedId(o.id);
												}}
											>
												<DotsIcon />
											</button>
										) : null}
									</div>
								</div>
							);
						})}
					</div>
				</div>

				<div className={styles.footer}>
					<div className={styles.pagination}>
						<button
							type="button"
							className={styles.pageBtn}
							aria-label="Previous page"
							onClick={() => pushParams({ page: Math.max(1, result.page - 1) })}
							disabled={result.page <= 1 || isPending}
						>
							<ArrowLeftIcon />
						</button>
						{pageWindow.map((p) => (
							<button
								key={p}
								type="button"
								className={`${styles.pageBtn} ${p === result.page ? styles.pageBtnActive : ""}`}
								aria-label={`Page ${p}`}
								onClick={() => pushParams({ page: p })}
								disabled={isPending}
							>
								<span className={styles.pageText}>{p}</span>
							</button>
						))}
						<button
							type="button"
							className={styles.pageBtn}
							aria-label="Next page"
							onClick={() => pushParams({ page: Math.min(result.totalPages, result.page + 1) })}
							disabled={result.page >= result.totalPages || isPending}
						>
							<ArrowRightIcon />
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}

