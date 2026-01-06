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

