import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    zone?: string;
    role?: string;
    company?: string;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      zone?: string;
      role?: string;
      company?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    zone?: string;
    role?: string;
    company?: string;
  }
}