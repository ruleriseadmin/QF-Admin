/** @type {import('next').NextConfig} */
const nextConfig = {
 
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'quick-cred-storage.s3.eu-north-1.amazonaws.com',
            pathname: '**',
          },
           
          {
            protocol: 'https',
            hostname: 'res.cloudinary.com',
            pathname: '**',
          },
          {
            protocol: 'https',
            hostname: 'graphicsfamily.com',
            pathname: '**',
          },
          {
            protocol: 'https',
            hostname: 'png.pngtree.com',
            pathname: '**',
          },
          
        ],
      },
};

export default nextConfig;
