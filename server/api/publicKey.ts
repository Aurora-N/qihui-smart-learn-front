import { readFileSync } from 'fs';
import { join } from 'path';

export default defineEventHandler((event) => {
    // 读取公钥文件
    const publicKeyPath = join(process.cwd(), 'server/assets/public_key.pem');
    const publicKey = readFileSync(publicKeyPath, 'utf-8');

    // 仅允许在 HTTPS 连接时返回公钥
    // if (process.env.NODE_ENV === 'production' && !event.node.req.headers['x-forwarded-proto']?.includes('https')) {
    //     throw createError({ statusCode: 403, message: '公钥仅允许在 HTTPS 下获取' });
    // }

    return { publicKey };
});
