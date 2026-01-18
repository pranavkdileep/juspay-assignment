import CenterOrderList from "../../components/center/CenterOrderList";
import { getOrders } from "./actions";

type SearchParams = Record<string, string | string[] | undefined>;

function pickFirst(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const q = pickFirst(sp.q) ?? "";
  const status = pickFirst(sp.status) ?? "all";
  const sort = pickFirst(sp.sort) ?? "date";
  const dir = pickFirst(sp.dir) ?? "desc";
  const page = Number(pickFirst(sp.page) ?? "1");

  const result = await getOrders({
    q,
    status: status as any,
    sort: sort as any,
    dir: dir as any,
    page,
    pageSize: 10,
  });

  return <CenterOrderList result={result} />;
}
