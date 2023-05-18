import { _ctx } from "./_ctx.js";
import { _math } from "./_math.js";
let math = new _math();

export class _sm3 {
    constructor(){
        this.ctx = new _ctx();
    } 

    sm3_init(ctx){
        ctx.digest = "7380166F4914B2B9172442D7DA8A0600A96F30BC163138AAE38DEE4DB0FB0E4E";
    }

    sm3_update(ctx, msg, len){
        let res = "";
        for (let i = 0; i < len; i++) {
            res += math.dec2Hex(msg.charCodeAt(i));
        }
        const res_length = res.length * 4;
        res += "8";
        while (res.length % 128 !== 112) {
            res += "0";
        }
        let res_len = math.dec2Hex(res_length);
        while (res_len.length !== 16) {
            res_len = "0" + res_len;
        }
            res += res_len;
        ctx.data = res;
    }
    
    sm3_final(md, ctx){
        let num = ctx.data.length/128;
        let V = ctx.digest;
        let B = "";
        let extensionB = "";
        let compressB = "";
        for (let i = 0; i < num; i++) {
            B = ctx.data.substr(i * 128, 128);
            extensionB = this.extension(B);
            compressB = this.compress(extensionB, V);
            V = math.xor(V, compressB);
        }
        for (let i = 0; i < 8; i++)
            md.str += V.substr(i * 8, 8);
    }

    compress(str1, str2) {
        let IV = str2;
        let A = IV.substr(0, 8),
        B = IV.substr(8, 8),
        C = IV.substr(16, 8),
        D = IV.substr(24, 8),
        E = IV.substr(32, 8),
        F = IV.substr(40, 8),
        G = IV.substr(48, 8),
        H = IV.substr(56, 8);
        let SS1 = "",SS2 = "",TT1 = "",TT2 = "";
        for (let j = 0; j < 64; j++) {
            SS1 = this.leftShift(this.modAdd(this.modAdd(this.leftShift(A, 12), E), this.leftShift(this.T(j), j % 32)), 7);
            SS2 = math.xor(SS1, this.leftShift(A, 12));
            TT1 = this.modAdd(this.modAdd(this.modAdd(this.FF(A, B, C, j), D), SS2), str1.substr((j + 68) * 8, 8));
            TT2 = this.modAdd(this.modAdd(this.modAdd(this.GG(E, F, G, j), H), SS1), str1.substr(j * 8, 8));
            D = C;
            C = this.leftShift(B, 9);
            B = A;
            A = TT1;
            H = G;
            G = this.leftShift(F, 19);
            F = E;
            E = this.P0(TT2);
        }
        let res = A + B + C + D + E + F + G + H;
        return res;
    }

    extension(str) {
        let res = str;

        for (let i = 16; i < 68; i++) {
            res += math.xor(math.xor(this.P1(math.xor(math.xor(res.substr((i-16)*8, 8), res.substr((i - 9) * 8, 8)), this.leftShift(res.substr((i - 3) * 8, 8), 15))), this.leftShift(res.substr((i - 13) * 8, 8), 7)), res.substr((i - 6) * 8, 8));
        }
        
        for (let i = 0; i < 64; i++) {
            res += math.xor(res.substr(i * 8, 8), res.substr((i + 4) * 8, 8));
        }

        return res;
    }

    leftShift(str, len) {
        let res = math.hex2Bin(str);
        res = res.substr(len) + res.substr(0, len);
        return math.bin2Hex(res);
    }

    modAdd(str1, str2) {
        let res1 = math.hex2Bin(str1);
        let res2 = math.hex2Bin(str2);
        let temp = '0';
        let res = "";
        for (let i = res1.length - 1; i >= 0; i--) {
            res = ((res1[i]^res2[i])^ temp) + res;
        if (res1[i]&res2[i] === '1')
            temp = '1';
        else if (res1[i]^ res2[i] === '1')
            temp = '1'&temp;
        else
            temp = '0';
        }
        return math.bin2Hex(res);
    }

    P1(str) {
        return math.xor(math.xor(str, this.leftShift(str, 15)), this.leftShift(str, 23));
    }
        
    P0(str) {
        return math.xor(math.xor(str, this.leftShift(str, 9)), this.leftShift(str, 17));
    }

    T(j) {
        if (0 <= j && j <= 15)
            return "79CC4519";
        else
            return "7A879D8A";
    }

    FF(str1, str2, str3, j) {
        if (0 <= j && j <= 15) {
        return math.xor(math.xor(str1, str2), str3);
        } else {
        return math.or(math.or(math.and(str1, str2), math.and(str1, str3)), math.and(str2, str3));
        }
    }
    
    GG(str1, str2, str3, j) {
        if (0 <= j && j <= 15) {
        return math.xor(math.xor(str1, str2), str3);
        } else {
        return math.or(math.and(str1, str2), math.and(math.not(str1), str3));
        }
    }

}