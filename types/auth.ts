export type RegisterErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
};

export type LoginErrors = {
  email?: string;
  password?: string;
  general?: string;
};
