"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchData(url: string) {
  //   await new Promise((resolve) => setTimeout(resolve, 3000)); // Comment in to see loading
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

export function useFetchData(endpoint: string) {
  return useQuery({
    queryKey: [endpoint],
    queryFn: () => fetchData(endpoint),
  });
}
