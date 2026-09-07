import createMDX from '@next/mdx';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  trailingSlash: true,
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  images: { unoptimized: true },
  transpilePackages: ['@cometal/examples', '@cometal/react', '@cometal/tokens'],
  allowedDevOrigins: ['192.168.31.202'],
};

export default withMDX(config);
