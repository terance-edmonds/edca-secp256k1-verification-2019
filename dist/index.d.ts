/// <reference types="types" />
import cryptoLd from 'crypto-ld';
export declare class EcdsaSecp256k1VerificationKey2019 extends cryptoLd.LDKeyPair {
    type: string;
    publicKeyBase58?: string;
    privateKeyBase58?: string;
    constructor({
        publicKeyBase58,
        privateKeyBase58,
        ...options
    }: EcdsaSecp256k1VerificationKey2019Options);
    static from(
        options:
            | EcdsaSecp256k1VerificationKey2019Options
            | EcdsaSecp256k1VerificationKey2019HexKeyOptions
    ): EcdsaSecp256k1VerificationKey2019;
    static generate({
        seed,
        compressed,
        ...keyPairOptions
    }: Omit<
        EcdsaSecp256k1VerificationKey2019GenerateOptions,
        'publicKeyBase58' | 'privateKeyBase58'
    > & {
        seed?: Uint8Array;
        compressed?: boolean;
    }): Promise<EcdsaSecp256k1VerificationKey2019>;
    export({
        publicKey,
        privateKey,
        includeContext
    }?: {
        publicKey?: boolean;
        privateKey?: boolean;
        includeContext?: boolean;
    }): ExportedKey;
    signer(): {
        sign({ data }: { data: Uint8Array }): Promise<string>;
        id: any;
    };
    verifier(): {
        verify({ data, signature }: { data: Uint8Array; signature: string }): Promise<boolean>;
        id: any;
    };
}
