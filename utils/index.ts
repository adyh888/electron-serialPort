/**
 * send 字符串转字节数据在转buffer
 * str:字符串
 */
export function strHexBuffer(str: string) {
    const bytes = [];
    for (let i = 0; i < str.length; i += 2) {
        bytes.push(parseInt(str.substr(i, 2), 16));
    }
    return  Buffer.from(bytes);
}
