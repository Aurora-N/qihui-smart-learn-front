import JSEncrypt from 'jsencrypt'
import { useAuthApi } from '~/api/auth'

let cachedPublicKey = ''

async function getPublicKey() {
  if (!cachedPublicKey) {
    const key = await useAuthApi().getKey()
    cachedPublicKey = key ? key : ''
  }
  return cachedPublicKey
}

export async function encryptWithRSA(text: string) {
  const publicKey = await getPublicKey()
  if (!publicKey) throw new Error('公钥获取失败')
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(`${publicKey}`)
  return encryptor.encrypt(text)
}
