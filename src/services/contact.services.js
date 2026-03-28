const serverApiDomain = `http://localhost:3000`;
// const serverApiDomain = `https://worldtourtrip.com`;

// ==== Submit contact form
export const submitContactForm = async (formData) => {
  try {
    const res = await fetch(`${serverApiDomain}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to submit contact form");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    return {
      status: false,
      message: "Something went wrong. Please try again.",
    };
  }
};

// ==== Get all contact submissions (admin use)
export const getContactList = async () => {
  try {
    const res = await fetch(`${serverApiDomain}/api/contact`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch contact list");
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
