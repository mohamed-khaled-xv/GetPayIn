export const SUPERADMIN_USER = 'admin'; // set any username
export const isSuperadmin = (u?: string) => !!u && u.toLowerCase() === SUPERADMIN_USER;
