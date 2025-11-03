import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard/mt",
        permanent: true, // atau false jika redirect-nya sementara
      },
      {
        source: "/dashboard",
        destination: "/dashboard/mt",
        permanent: true, // atau false jika redirect-nya sementara
      },
    ];
  },
};

export default nextConfig;
