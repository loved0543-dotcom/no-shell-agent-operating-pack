/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '/api/[transport]': ['./delivery/**/*', './docs/**/*', './free/**/*', './starter/**/*']
  }
};

export default nextConfig;
