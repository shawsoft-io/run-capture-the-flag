import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

// Protect all routes with authentication
export default withMiddlewareAuthRequired({
  returnTo: (req) => {
    const requestedPath = req.nextUrl.pathname;
    return `/api/auth/login?returnTo=${encodeURIComponent(requestedPath)}`;
  },
});

export const config = {
  matcher: ['/athlete/:path*', '/admin/:path*'], 
};