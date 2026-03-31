const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;

export const fetcher = (url: string) => {
  fetch(`${BASE}${url}`).then(res => res.json());
}