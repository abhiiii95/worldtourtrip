// const serverApiDomain = `http://localhost:3001`;

export const getBlogList = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog`, {
      method: "GET",
      cache: "no-store",
    });

   

    if (!res.ok) {
      throw new Error("Failed to fetch");
    }

    const data = await res.json();

    return data;
  } catch (error) {
   

    return {
      status: false,
      data: [],
    };
  }
};


// ==== detail blog
export const getDetailBlog = async (id) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/${id}`, {
      method: "GET",
      cache: "no-store",
    });

   

    if (!res.ok) {
      throw new Error("Failed to fetch");
    }

    const data = await res.json();

    return data;
  } catch (error) {
   

    return {
      status: false,
      data: [],
    };
  }
};
