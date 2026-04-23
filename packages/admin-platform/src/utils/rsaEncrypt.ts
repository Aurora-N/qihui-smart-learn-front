import JSEncrypt from "jsencrypt"
import { getPublicKey } from "../api/auth"

let cachedPublicKey = ""

async function fetchPublicKey() {
  if (!cachedPublicKey) {
    try {
      const key = await getPublicKey()
      // API client might return the wrapped response if standard format is not followed exactly 
      // but assuming it unwraps to string or object with data string based on standard behavior.
      cachedPublicKey = (key as any).data ? (key as any).data : (key || "")
    } catch (e) {
      console.error("Failed to fetch public key", e)
    }
  }
  return cachedPublicKey
}

export async function encryptWithRSA(text: string) {
  const publicKey = await fetchPublicKey()
  if (!publicKey) throw new Error("公钥获取失败")
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(`${publicKey}`)
  const encrypted = encryptor.encrypt(text)
  if (!encrypted) throw new Error("加密失败")
  return encrypted
}