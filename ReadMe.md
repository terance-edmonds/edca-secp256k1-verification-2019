# EcdsaSecp256k1VerificationKey2019

This TypeScript class represents an implementation of the EcdsaSecp256k1VerificationKey2019 suite for generating, exporting, signing, and verifying ECDSA secp256k1 keys.

## Installation

To use this class in your TypeScript project, you can install the required dependencies using npm or yarn:

```bash
npm install or yarn install
```

# Usage

You can import the EcdsaSecp256k1VerificationKey2019 class and use its methods to generate, export, sign, and verify ECDSA secp256k1 keys.

```ts
import { EcdsaSecp256k1VerificationKey2019 } from 'edca-secp256k1-verification-2019';

/* Example usage */
const keyPair = await EcdsaSecp256k1VerificationKey2019.generate();
const publicKey = keyPair.export({ publicKey: true });
console.log('Public Key:', publicKey);

const dataToSign = Uint8Array.from([1, 2, 3, 4, 5]);
const signature = await keyPair.signer().sign({ data: dataToSign });
console.log('Signature:', signature);

const isVerified = await keyPair.verifier().verify({ data: dataToSign, signature });
console.log('Is Verified:', isVerified);
```

# API

`EcdsaSecp256k1VerificationKey2019`

**Constructor**
* `constructor(options: EcdsaSecp256k1VerificationKey2019Options)`: Initializes a new instance of the class.

**Static Methods**
* `from(options: EcdsaSecp256k1VerificationKey2019Options)`: Creates an instance of the class from options.
* `generate(options: EcdsaSecp256k1VerificationKey2019GenerateOptions)`: Generates a new key pair.
Instance Methods
****
* `export(options?: ExportOptions)`: Exports the key pair.
* `signer()`: Returns a signer object for signing data.
* `verifier()`: Returns a verifier object for verifying signatures.

# Attribution
This code is based on the <a target="_blank" href="https://www.npmjs.com/package/@bloomprotocol/ecdsa-secp256k1-verification-key-2019">@bloomprotocol/ecdsa-secp256k1-verification-key-2019</a> package.
