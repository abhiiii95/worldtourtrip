import { serverApiDomain } from "@/static/static";

export const getPackageList = async (params = {}) => {
  try {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== "") qs.set(k, v); });
    const url = `${serverApiDomain}/api/package${qs.toString() ? "?" + qs.toString() : ""}`;

    const res = await fetch(url, { method: "GET", cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch packages");
    return await res.json();
  } catch {
    return { success: false, data: [] };
  }
};

export const getPackageBySlug = async (slug) => {
  try {
    const res = await fetch(`${serverApiDomain}/api/package/${slug}`, { method: "GET", cache: "no-store" });
     console.log(res,"res")
    if (!res.ok) throw new Error("Failed to fetch package");
    
    return await res.json();
   
  } catch {
    return { success: false, data: null };
  }
};

export const searchPackages = async (q) => {
  try {
    const res = await fetch(`${serverApiDomain}/api/package/search?q=${encodeURIComponent(q)}`, {
      method: "GET",
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Search failed");
    return await res.json();
  } catch {
    return { success: false, data: [] };
  }
};
