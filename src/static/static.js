export const navLinks = [
    {
      id: 1,
      route: "/",
      routeText: "Home",
    },
    {
      id: 2,
      route: "/about",
      routeText: "About Us",
    },
    // {
    //   id: 3,
    //   route: "/blog",
    //   routeText: "Blogs",
    // },
    {
      id: 4,
      route: "/contact",
      routeText: "Contact Us",
    },
  ];
  export const BaseUrl = "https://www.worldtourtrip.com";

// for date
  export function formatBlogDate(isoDate) {
    return new Date(isoDate)
      .toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
      .replace(",", " ,");
  }