// const serverApiDomain = `http://localhost:3001`;
const serverApiDomain = `https://worldtourtrip.com`;
export const getBlogList = async () => {

  try {
    const res = await fetch(`${serverApiDomain}/api/blog`, {
      method: "GET",
      cache: "no-store",
    });

    console.log(res,"data res")
   

    if (!res.ok) {
      throw new Error("Failed to fetch");
    }


    const data = await res.json();
    console.log(data,"data api")

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
    const res = await fetch(`${serverApiDomain}/api/blog/${id}`, {
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
