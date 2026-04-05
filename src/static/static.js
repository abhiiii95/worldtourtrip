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
    {
      id: 3,
      route: "/blog",
      routeText: "Blogs",
    },
    {
      id: 4,
      route: "/destination",
      routeText: "Destination",
    },
    {
      id: 4,
      route: "/contact",
      routeText: "Contact Us",
    },
  ];
  export const BaseUrl = "https://www.worldtourtrip.com";
  const serverApiDomain = `https://worldtourtrip.com`;
  // export const serverApiDomain = `http://localhost:3000`;

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

  // === blog date
  export const getDatePart = (dateString, type) => {
    const date = new Date(dateString);
  
    const months = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];
  
    switch (type) {
      case "day":
        return date.getDate();
  
      case "month":
        return months[date.getMonth()]; // returns Jan, Feb, Mar...
  
      case "year":
        return date.getFullYear();
  
      default:
        return null;
    }
  };


  // ==== common function remove css
  // Utility function to remove inline styles
  export const removeInlineStyles = (htmlString) => {
    if (!htmlString) return '';
  
    // SSR fallback — use regex
    if (typeof document === 'undefined') {
      return htmlString.replace(/\s*style\s*=\s*["'][^"']*["']/gi, '');
    }
  
    // Client-side — use DOM
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    tempDiv.querySelectorAll('*').forEach(el => el.removeAttribute('style'));
    return tempDiv.innerHTML;
  };