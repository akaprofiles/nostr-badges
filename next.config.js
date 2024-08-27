/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    LOGIN_PAGE: "/",
    USER_HOME_PAGE: "/profile",
    DEV_HOME_PAGE: "/creator",
  },
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
