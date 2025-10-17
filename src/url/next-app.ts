import { usePathname, useRouter, useSearchParams } from "next/navigation";

/** Extract selected params via Next App Router */
export function useQueryParams(params: string[]): Record<string, string | null> {
  const sp = useSearchParams();
  const out: Record<string, string | null> = {};
  for (const k of params) out[k] = sp.get(k);
  return out;
}

/** Update/remove a single query param via Next App Router */
export function useSetQueryParam(): (key: string, value: string | null) => void {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  return (key, value) => {
    const next = new URLSearchParams(sp.toString());
    if (value == null || value === "") next.delete(key);
    else next.set(key, value);

    const search = next.toString();
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
  };
}
