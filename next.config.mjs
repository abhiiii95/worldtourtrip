/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      // non-www → www
      {
        source: "/:path*",
        has: [{ type: "host", value: "worldtourtrip.com" }],
        destination: "https://www.worldtourtrip.com/:path*",
        permanent: true,
      },
      // http → https (www)
      {
        source: "/:path*",
        has: [{ type: "host", value: "worldtourtrip.com" }],
        destination: "https://www.worldtourtrip.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
