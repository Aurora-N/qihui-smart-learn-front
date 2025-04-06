import { useUserApi } from '~/api/user';
import JSEncrypt from 'jsencrypt';

let cachedPublicKey = '';

async function getPublicKey() {
    if (!cachedPublicKey) {
        const key = await useUserApi().getKey();
        cachedPublicKey = key ? key : '';
    }
    return cachedPublicKey;
}

export async function encryptWithRSA(text) {
    const publicKey = await getPublicKey();
    console.log(publicKey);
    if (!publicKey) throw new Error('公钥获取失败');
    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(`${publicKey}`);
    return encryptor.encrypt(text);
}
