export interface AdminUser {

  id: number;
  username: string;
  email: string;
  isActive: boolean;
  emailIsVerified: boolean;
  registrationDate: string;
  roleId: number;
  roleDescription: string;

}
