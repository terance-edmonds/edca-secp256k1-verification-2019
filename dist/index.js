'use strict';
var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
        ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              var desc = Object.getOwnPropertyDescriptor(m, k);
              if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
                  desc = {
                      enumerable: true,
                      get: function () {
                          return m[k];
                      }
                  };
              }
              Object.defineProperty(o, k2, desc);
          }
        : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              o[k2] = m[k];
          });
var __setModuleDefault =
    (this && this.__setModuleDefault) ||
    (Object.create
        ? function (o, v) {
              Object.defineProperty(o, 'default', { enumerable: true, value: v });
          }
        : function (o, v) {
              o['default'] = v;
          });
var __importStar =
    (this && this.__importStar) ||
    function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };
var __rest =
    (this && this.__rest) ||
    function (s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === 'function')
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.EcdsaSecp256k1VerificationKey2019 = void 0;
// @ts-nocheck
const base64url_1 = __importDefault(require('base64url'));
const create_hash_1 = __importDefault(require('create-hash'));
const secp256k1 = __importStar(require('secp256k1'));
const randombytes_1 = __importDefault(require('randombytes'));
const crypto_ld_1 = __importDefault(require('crypto-ld'));
const base_58_1 = __importDefault(require('base-58'));
const SUITE_ID = 'EcdsaSecp256k1VerificationKey2019';
const sha256 = (data) => (0, create_hash_1.default)('sha256').update(data).digest();
class EcdsaSecp256k1VerificationKey2019 extends crypto_ld_1.default.LDKeyPair {
    constructor(_a) {
        var { publicKeyBase58, privateKeyBase58 } = _a,
            options = __rest(_a, ['publicKeyBase58', 'privateKeyBase58']);
        super(options);
        if (privateKeyBase58 && !publicKeyBase58) {
            const publicKey = secp256k1.publicKeyCreate(base_58_1.default.decode(privateKeyBase58));
            this.publicKeyBase58 = base_58_1.default.encode(publicKey);
        } else {
            this.publicKeyBase58 = publicKeyBase58;
        }
        this.type = SUITE_ID;
        this.privateKeyBase58 = privateKeyBase58;
        if (!this.publicKeyBase58) {
            throw new TypeError('The "publicKeyBase58" property is required.');
        }
    }
    static from(options) {
        if (options.publicKeyHex || options.privateKeyHex) {
            const _a = options,
                { publicKeyHex, privateKeyHex } = _a,
                rest = __rest(_a, ['publicKeyHex', 'privateKeyHex']);
            return new EcdsaSecp256k1VerificationKey2019(
                Object.assign(Object.assign({}, rest), {
                    publicKeyBase58: publicKeyHex
                        ? base_58_1.default.encode(Buffer.from(publicKeyHex, 'hex'))
                        : undefined,
                    privateKeyBase58: privateKeyHex
                        ? base_58_1.default.encode(Buffer.from(privateKeyHex, 'hex'))
                        : undefined
                })
            );
        }
        return new EcdsaSecp256k1VerificationKey2019(options);
    }
    static async generate(_a) {
        var { seed, compressed } = _a,
            keyPairOptions = __rest(_a, ['seed', 'compressed']);
        if (seed && !secp256k1.privateKeyVerify(seed)) {
            throw new Error('Provided seed is not a valid private key');
        }
        let privateKey = seed;
        while (typeof privateKey === 'undefined' || !secp256k1.privateKeyVerify(privateKey)) {
            privateKey = new Uint8Array((0, randombytes_1.default)(32));
        }
        const publicKey = secp256k1.publicKeyCreate(privateKey, compressed);
        const publicKeyCompressed = secp256k1.publicKeyCreate(privateKey, true);
        return new EcdsaSecp256k1VerificationKey2019(
            Object.assign(
                {
                    publicKeyBase58: base_58_1.default.encode(publicKey),
                    privateKeyBase58: base_58_1.default.encode(privateKey),
                    id: `did:ethr:0x${Buffer.from(publicKeyCompressed).toString('hex')}`,
                    controller: `did:ethr:0x${Buffer.from(publicKeyCompressed).toString(
                        'hex'
                    )}#owner`
                },
                keyPairOptions
            )
        );
    }
    export({ publicKey = false, privateKey = false, includeContext = false } = {}) {
        if (!(publicKey || privateKey)) {
            throw new TypeError('export requires specifying either "publicKey" or "privateKey".');
        }
        if (privateKey && !this.privateKeyBase58) {
            throw new TypeError('No privateKey to export.');
        }
        if (publicKey && !this.publicKeyBase58) {
            throw new TypeError('No publicKey to export.');
        }
        const exported = {
            type: this.type,
            id: this.id,
            controller: this.controller,
            revoked: this.revoked
        };
        if (includeContext) {
            exported['@context'] = EcdsaSecp256k1VerificationKey2019.SUITE_CONTEXT;
        }
        if (privateKey) exported.privateKeyBase58 = this.privateKeyBase58;
        if (publicKey) exported.publicKeyBase58 = this.publicKeyBase58;
        return exported;
    }
    signer() {
        const { privateKeyBase58 } = this;
        if (!privateKeyBase58) {
            return {
                async sign() {
                    throw new Error('No private key to sign with.');
                },
                id: this.id
            };
        }
        return {
            async sign({ data }) {
                const encodedHeader = base64url_1.default.encode(
                    JSON.stringify({
                        alg: 'ES256K',
                        b64: false,
                        crit: ['b64']
                    })
                );
                const payload = Buffer.from(data.buffer, data.byteOffset, data.length);
                const digest = sha256(
                    Buffer.from(
                        Buffer.concat([
                            Buffer.from(`${encodedHeader}.`, 'utf8'),
                            Buffer.from(payload.buffer, payload.byteOffset, payload.length)
                        ])
                    )
                );
                const { signature } = secp256k1.ecdsaSign(
                    digest,
                    base_58_1.default.decode(privateKeyBase58)
                );
                const encodedSignature = base64url_1.default.encode(Buffer.from(signature));
                return `${encodedHeader}..${encodedSignature}`;
            },
            id: this.id
        };
    }
    verifier() {
        const { publicKeyBase58 } = this;
        if (!publicKeyBase58) {
            return {
                async verify() {
                    throw new Error('No public key to verify against');
                },
                id: this.id
            };
        }
        return {
            async verify({ data, signature }) {
                if (signature.indexOf('..') < 0) return false;
                const [encodedHeader, encodedSignature] = signature.split('..');
                const header = JSON.parse(base64url_1.default.decode(encodedHeader));
                const isHeaderInvalid =
                    header.alg !== 'ES256K' ||
                    header.b64 !== false ||
                    !header.crit ||
                    !header.crit.length ||
                    header.crit[0] !== 'b64';
                if (isHeaderInvalid) return false;
                const payload = Buffer.from(data.buffer, data.byteOffset, data.length);
                const digest = sha256(
                    Buffer.from(
                        Buffer.concat([
                            Buffer.from(`${encodedHeader}.`, 'utf8'),
                            Buffer.from(payload.buffer, payload.byteOffset, payload.length)
                        ])
                    )
                );
                let verified;
                try {
                    verified = secp256k1.ecdsaVerify(
                        Buffer.from(base64url_1.default.decode(encodedSignature, 'hex'), 'hex'),
                        digest,
                        base_58_1.default.decode(publicKeyBase58)
                    );
                } catch (e) {
                    verified = false;
                }
                return verified;
            },
            id: this.id
        };
    }
}
exports.EcdsaSecp256k1VerificationKey2019 = EcdsaSecp256k1VerificationKey2019;
EcdsaSecp256k1VerificationKey2019.suite = SUITE_ID;
EcdsaSecp256k1VerificationKey2019.SUITE_CONTEXT = 'https://ns.did.ai/suites/secp256k1-2019/v1';
//# sourceMappingURL=index.js.map
