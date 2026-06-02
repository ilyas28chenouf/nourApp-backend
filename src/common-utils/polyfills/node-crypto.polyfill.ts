import * as nodeCrypto from 'crypto';

const globalScope = globalThis as any;

if (!globalScope.crypto) {
  globalScope.crypto = nodeCrypto;
}

if (!globalScope.crypto.randomUUID) {
  globalScope.crypto.randomUUID = nodeCrypto.randomUUID;
}
