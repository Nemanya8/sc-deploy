import type { NextConfig } from "next";
import path from "path";
import CopyPlugin from "copy-webpack-plugin";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });

    if (isServer) {
      config.plugins.push(
        new CopyPlugin({
          patterns: [
            {
              from: path.join(__dirname, "node_modules/@parity/resolc/dist/resolc/resolc.wasm"),
              to: path.join(__dirname, ".next/server/app/api/compile/resolc.wasm"),
            },
          ],
        })
      );
    }

    return config;
  },
};

export default nextConfig;
