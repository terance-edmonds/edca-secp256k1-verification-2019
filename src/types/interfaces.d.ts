type ExportedKey = {
    '@context'?: string;
    type: string;
    id: string;
    controller: string;
    publicKeyBase58?: string;
    privateKeyBase58?: string;
    revoked?: boolean;
};

type EcdsaSecp256k1VerificationKey2019Options = {
    controller: string;
    id: string;
    revoked?: boolean;
    publicKeyBase58?: string;
    privateKeyBase58?: string;
};

type EcdsaSecp256k1VerificationKey2019GenerateOptions = {
    controller: string;
    id: string;
    revoked?: boolean;
    publicKeyBase58?: string;
    privateKeyBase58?: string;
};

type EcdsaSecp256k1VerificationKey2019HexKeyOptions = {
    controller: string;
    id: string;
    revoked?: boolean;
    publicKeyBase58?: string;
    privateKeyBase58?: string;
};
