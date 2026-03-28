const serverApiDomain = `http://localhost:3000`;
// const serverApiDomain = `https://worldtourtrip.com`;
export const getDestinationList = async () => {

  try {
    const res = await fetch(`${serverApiDomain}/api/destination`, {
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
export const getDetailDestination = async (id) => {
  try {
    const res = await fetch(`${serverApiDomain}/api/destination/${id}`, {
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
