import { serverApiDomain } from "@/static/static";

export const getDestinationList = async () => {
  try {
    const res = await fetch(`${serverApiDomain}/api/destination`, {
      method: "GET",
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch");
    return await res.json();
  } catch {
    return { status: false, destinations: [] };
  }
};

export const getDetailDestination = async (id) => {
  try {
    const res = await fetch(`${serverApiDomain}/api/destination/${id}`, {
      method: "GET",
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Failed to fetch");
    return await res.json();
  } catch {
    return { status: false, destinations: null };
  }
};
