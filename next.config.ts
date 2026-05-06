import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    generateEtags: false,
    reactCompiler: true,
    sassOptions: {
        implementation: "sass-embedded",
    },
};

export default nextConfig;
