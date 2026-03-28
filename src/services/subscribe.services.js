export const subscribeEmail = async (email) => {
  try {
    const res = await fetch(`${serverApiDomain}/api/subscribe`, {
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
