
export type AuthContext = {
    accoundId: string;
    sessionId: string;
    tokenId: string;
};

export type AuthenticatedSession = {
accountId: string;
sessionId: string;
accessToken: string;
refreshToken: string;
csrfToken: string;
refreshExpiresAt: Date;
};
