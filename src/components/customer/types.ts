export type RecoverPasswordFormState = {
  success?: {
    status: boolean;
    msg: string;
  };
  errors?: {
    email?: string[];
    apiRes?: {
      status: boolean;
      msg: string;
    };
  };
};

export type RegisterInputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};
