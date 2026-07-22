import createMDX from '@next/mdx';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  trailingSlash: true,
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  images: { unoptimized: true },
  transpilePackages: ['@cometal/react', '@cometal/tokens'],
};

export default withMDX(config);
