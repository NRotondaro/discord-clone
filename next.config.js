/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil',
    });

    return config;
  },
  images: {
    domains: ['3t7ecb7i3a.ufs.sh'],
  },
};

module.exports = nextConfig;
