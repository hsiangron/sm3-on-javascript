export class SM3 {
    constructor() {
        this.v = new Array(8);
        this.iv = new Array(8);
        this.sm3_len = 0;
        this.total_len = 0;
        this.buf = new Array(64);
        this.buf_len = 0;
        this.T_00_15 = 0x79cc4519;
        this.T_16_63 = 0x7a879d8a;
        this.IV = [
            0x7380166f,
            0x4914b2b9,
            0x172442d7,
            0xda8a0600,
            0xa96f30bc,
            0x163138aa,
            0xe38dee4d,
            0xb0fb0e4e,
        ];
        this.sm3_init();
    }

    sm3_init() {
        for (let i = 0; i < 8; i++) {
            this.v[i] = this.IV[i];
        }
        this.sm3_len = 0;
        this.total_len = 0;
        this.buf_len = 0;
    }

    sm3_compress() {
        let a, b, c, d, e, f, g, h, ss1, ss2, tt1, tt2;
        let v = this.v;
        let w = new Array(68);
        for (let i = 0; i < 16; i++) {
            w[i] = this.buf[i] ^ 0x36;
        }
        for (let i = 16; i < 68; i++) {
            w[i] = this.P1(w[i - 16] ^ w[i - 9] ^ (w[i - 3] << 15)) ^ (w[i - 13] << 7) ^ w[i - 6];
        }
        a = v[0];
        b = v[1];
        c = v[2];
        d = v[3];
        e = v[4];
        f = v[5];
        g = v[6];
        h = v[7];
        for (let i = 0; i < 16; i++) {
            ss1 = ((a << 12) + e + this.P0(i)) & 0xffffffff;
            ss1 = this.rol(ss1, 7);
            ss2 = ss1 ^ ((a << 12) + e);
            tt1 = this.ff_00_15(a, b, c) + d + ss2 + w[i];
            tt2 = this.gg_00_15(e, f, g) + h + ss1 + w[i];
            d = c;
            c = this.rol(b, 9);
            b = a;
            a = tt1;
            h = g;
            g = this.rol(f, 19);
            f = e;
            e = this.P0(tt2);
        }
        for (let i = 16; i < 64; i++) {
            ss1 = ((a << 12) + e + this.P0(i)) & 0xffffffff;
            ss1 = this.rol(ss1, 7);
            ss2 = ss1 ^ ((a << 12) + e);
            tt1 = this.ff_16_63(a, b, c) + d + ss2 + w[i];
            tt2 = this.gg_16_63(e, f, g) + h + ss1 + w[i];
            d = c;
            c = this.rol(b, 9);
            b = a;
            a = tt1;
            h = g;
            g = this.rol(f, 19);
            f = e;
            e = this.P0(tt2);
        }
        v[0] ^= a;
        v[1] ^= b;
        v[2] ^= c;
        v[3] ^= d;
        v[4] ^= e;
        v[5] ^= f;
        v[6] ^= g;
        v[7] ^= h;
    }

    sm3_update(msg) {
        let input = msg;
        let ilen = msg.length;
        let fill;
        let left = this.total_len & 0x3f;
        let input_index = 0;
        this.total_len += ilen;
        if (left + ilen >= 64) {
            fill = new Array(64 - left);
            for (let i = 0; i < fill.length; i++) {
                fill[i] = input[input_index++];
            }
            this.byte_array_operate(this.buf, this.buf, 0, fill, 0, 64);
            this.sm3_compress();
            left = 0;
        } else {
            fill = new Array(ilen);
            for (let i = 0; i < fill.length; i++) {
                fill[i] = input[input_index++];
            }
        }
        this.byte_array_operate(this.buf, this.buf, left, fill, 0, ilen);
    }

    sm3_final() {
        let index = this.buf_len;
        let bit_len = this.total_len * 8;
        let tmp;
        if (this.buf_len == 56) {
            this.buf[index++] = 0x80;
        } else {
            if (this.buf_len < 56) {
                this.buf[index++] = 0x80;
                while (index < 56) {
                    this.buf[index++] = 0x00;
                }
            } else {
                this.buf[index++] = 0x80;
                while (index < 64) {
                    this.buf[index++] = 0x00;
                }
                this.sm3_compress();
                for (let i = 0; i < 56; i++) {
                    this.buf[i] = 0x00;
                }
            }
        }
        tmp = bit_len.toString(16).toUpperCase();
        while (tmp.length < 16) {
            tmp = "0" + tmp;
        }
        tmp = this.hex_to_byte_array(tmp);
        this.byte_array_operate(this.buf, this.buf, 56, tmp, 0, 8);
        this.sm3_compress();
        let hash = new Array(32);
        for (let i = 0; i < 8; i++) {
            this.number_to_be(this.v[i], hash, i * 4);
        }
        return hash;
    }

    byte_array_operate(dst, src1, offset1, src2, offset2, count) {
        for (let i = 0; i < count; i++) {
            dst[offset1 + i] = src1[offset1 + i] ^ src2[offset2 + i];
        }
    }

    P0(x) {
        return x ^ this.rol(x, 9) ^ this.rol(x, 17);
    }

    P1(x) {
        return x ^ this.rol(x, 15) ^ this.rol(x, 23);
    }

    ff_00_15(x, y, z) {
        return x ^ y ^ z;
    }

    ff_16_63(x, y, z) {
        return (x & y) | (x & z) | (y & z);
    }

    gg_00_15(x, y, z) {
        return x ^ y ^ z;
    }

    gg_16_63(x, y, z) {
        return (x & y) | (~x & z);
    }

    rol(x, n) {
        return (x << n) | (x >>> (32 - n));
    }

    number_to_be(n, dst, offset) {
        dst[offset] = (n >>> 24) & 0xff;
        dst[offset + 1] = (n >>> 16) & 0xff;
        dst[offset + 2] = (n >>> 8) & 0xff;
        dst[offset + 3] = n & 0xff;
    }

    hex_to_byte_array(str) {
        let len = str.length;
        let arr = new Array(len / 2);
        for (let i = 0; i < len; i += 2) {
            arr[i / 2] = parseInt(str.substr(i, 2), 16);
        }
        return arr;
    }

    sm3(str) {
        let msg = this.hex_to_byte_array(unescape(encodeURIComponent(str)));
        this.sm3_update(msg);
        let hash = this.sm3_final();
        let result = "";
        for (let i = 0; i < hash.length; i++) {
            result += hash[i].toString(16).toUpperCase();
        }
        return result;
    }
}

