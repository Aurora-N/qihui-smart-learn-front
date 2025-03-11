import { useFetch } from '#imports';
import JSEncrypt from 'jsencrypt';

let cachedPublicKey = '';

async function getPublicKey() {
    if (!cachedPublicKey) {
        const { data } = await useFetch('/api/publicKey');
        cachedPublicKey = data.value?.publicKey || '';
    }
    return cachedPublicKey;
    // const data = await useFetch('/api/publicKey');
    // console.log(data)
}

export async function encryptWithRSA(text) {
    const publicKey = await getPublicKey();
    if (!publicKey) throw new Error('公钥获取失败');
    console.log(publicKey);
    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(publicKey);
    return encryptor.encrypt(text);
}
