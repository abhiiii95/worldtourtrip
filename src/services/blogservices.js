import { serverApiDomain } from "@/static/static";

export const getBlogList = async () => {
  try {
    const res = await fetch(`${serverApiDomain}/api/blog`, {
      method: "GET",
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch");
    return await res.json();
  } catch {
    return { status: false, data: [] };
  }
};

export const getDetailBlog = async (id) => {
  try {
    const res = await fetch(`${serverApiDomain}/api/blog/${id}`, {
      method: "GET",
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Failed to fetch");
    return await res.json();
  } catch {
    return { status: false, data: [] };
  }
};
