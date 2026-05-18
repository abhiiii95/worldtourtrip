// Subscribe uses a relative URL — works on both local and production
export const subscribeEmail = async (email) => {
  try {
    const res = await fetch(`/api/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return await res.json();
  } catch {
    return { status: false, message: "Network error. Please try again." };
  }
};
