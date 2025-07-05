// types/user.ts

export interface User {
  id: string;
  user_name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer' | string; // extend as needed
  company_name: string;
  zone: string;
}
