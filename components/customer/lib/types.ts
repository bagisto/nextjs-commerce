// types.ts or inline at the top

export type RecoverPasswordFormState = {
  errors?: {
    email?: string[];
    apiRes?: {
      status: boolean;
      msg: string;
    };
  };
};
