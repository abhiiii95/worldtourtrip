// import { serverApiDomain } from "@/static/static";
const serverApiDomain = `https://worldtourtrip.com`;

export const subscribeEmail = async (email) => {
  try {
    const res = await fetch(`/api/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return { status: false, message: "Network error. Please try again." };
  }
};
