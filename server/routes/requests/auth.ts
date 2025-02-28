/**
 * Basic user authentication identity.
 */
export type BasicUserIdentity = {
    email: string;
    password: string;
};

/**
 * Represents a register request.
 */
export type RegisterRequest = BasicUserIdentity & {
    handle: string;
};
