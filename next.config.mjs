import nextPWA from "next-pwa";

const withPWA = nextPWA({
  dest: "public",
});

const nextConfig = {};

export default withPWA(nextConfig);