export class SM3 {
    constructor() {
    
    }

    //将二进制转换为十六进制
    Bin2Hex(str) {
        let result = "";
        for (let i = 0; i < str.length; i++) {
            let tmp = str.charCodeAt(i).toString(16);
            if (tmp.length === 1) {
                tmp = "0" + tmp;
            }
            result += tmp;
        }
        return result;
    }

    //将十六进制转换为二进制
    Hex2Bin(str) {
        let result = "";
        for (let i = 0; i < len(str); i += 2) {
            result += String.fromCharCode(parseInt(str.substr(i, 2), 16));
        }
        return result;
    }
 
    //将二进制转为十进制
    Bin2Dec(str) {
        let result = 0;
        for(let i = str.length - 1; i >= 0; i--) {
            result += parseInt(str[i]) * Math.pow(2, str.length - 1 - i);
        }
        return result;
    }

    //将十进制转为二进制
    Dec2Bin(str) {
        let result = "";
        for(let i=0; i<str.length; i++) {
            let tmp = str[i];
            for(let j=0; j<8; j++) {
                result += tmp % 2;
                tmp = Math.floor(tmp / 2);
            }
        }
        return result.split("").reverse().join("");
    }

    //将十进制转为十六进制
    Dec2Hex(str) {
        let result = "";
        for(let i=0; i<str.length; i++) {
            let tmp = str[i];
            for(let j=0; j<2; j++) {
                let t = tmp % 16;
                if(t < 10) {
                    result += t;
                } else {
                    result += String.fromCharCode(t + 87);
                }
                tmp = Math.floor(tmp / 16);
            }
        }
        return result.split("").reverse().join("");
    }

    //将十六进制转为十进制
    Hex2Dec(str) { 
        let result = 0;
        for(let i=str.length-1; i>=0; i--) {
            let tmp = str[i];
            if(tmp >= '0' && tmp <= '9') {
                result += (tmp - '0') * Math.pow(16, str.length - 1 - i);
            } else {
                result += (tmp.charCodeAt(0) - 87) * Math.pow(16, str.length - 1 - i);
            }
        }
        return result;
    }  

    //对数据进行填充 
    padding(str) {
        let len = str.length;
        let k = 448 - (len + 1) % 512;
        if(k <= 0) {
            k = 960 - (len + 1) % 512;
        }
        let result = str + "1";
        for(let i=0; i<k; i++) {
            result += "0";
        }
        let tmp = this.Dec2Bin(len);
        for(let i=0; i<64-tmp.length; i++) {
            result += "0";
        }
        result += tmp;
        return result;
    }

    //循环左移
    leftShift(str, n) {
        let result = "";
        for(let i=0; i<str.length; i++) {
            result += str[(i + n) % str.length];
        }
        return result;
    }

    //实现异或
    XOR(str1, str2) {
        let result = "";
        str1 = this.Hex2Bin(str1);
        str2 = this.Hex2Bin(str2);
        for (let i = 0; i < str1.length; i++) {
            result += str1[i] ^ str2[i];
        }
        return result;
    }

    //实现与
    AND(str1, str2) {
        let result = "";
        str1 = this.Hex2Bin(str1);
        str2 = this.Hex2Bin(str2);
        for (let i = 0; i < str1.length; i++) {
            result += str1[i] & str2[i];
        }
        return result;
    }

    //实现或
    OR(str1, str2) {
        let result = "";
        str1 = this.Hex2Bin(str1);
        str2 = this.Hex2Bin(str2);
        for (let i = 0; i < str1.length; i++) {
            result += str1[i] | str2[i];
        }
        return result;
    }

    
    //实现非
    NOR(str1, str2) {
        let result = "";
        str1 = this.Hex2Bin(str1);
        str2 = this.Hex2Bin(str2);
        for (let i = 0; i < str1.length; i++) {
            result += ~(str1[i] | str2[i]);
        }
        return result;
    }

    //实现对2^32次方取模
    modAdd(str1, str2) {
        let res1 = this.Hex2Bin(str1);
        let res2 = this.Hex2Bin(str2);
        let temp = '0';
        let res = "";
        for (let i = res1.length - 1; i >= 0; i--) {
            res = (res1[i] ^ res2[i]) ^ temp + res;
            if (res1[i] & res2[i] == '1') 
                temp = '1';
            else if (res1[i] ^ res2[i] == '1') 
                    temp = '1' & temp;
                else 
                temp = '0';
        }
        return this.Bin2Hex(res);
    }

    //实现置换功能P0（X）   
    P0(str) {
        return this.XOR(this.XOR(str, this.leftShift(str, 9)), this.leftShift(str, 17));
    }   

    //实现置换功能P1（X）
    P1(str) {
        return this.XOR(this.XOR(str, this.leftShift(str, 15)), this.leftShift(str, 23));
    }

    //返回Tj常量值的函数实现
    Tj(i) {
        if (i >= 0 && i <= 15) {
            return "79cc4519";
        } else if (i >= 16 && i <= 63) {
            return "7a879d8a";
        }
    }

    //实现布尔函数FF功能
    FF(X, Y, Z, i) {
        if (i >= 0 && i <= 15) {
            return this.XOR(this.XOR(X, Y), Z);
        } else if (i >= 16 && i <= 63) {
            return this.OR(this.OR(this.AND(X, Y), this.AND(X, Z)), this.AND(Y, Z));
        }
    }

    //实现布尔函数GG功能
    GG(X, Y, Z, i) {
        if(i >= 0 && i <= 15) {
            return this.XOR(this.XOR(X, Y), Z);
        }
        else if(i >= 16 && i <= 63) {
            return this.OR(this.OR(this.AND(X, Y), this.AND(~X, Z)), this.AND(~X, Y));
        }
    }
    
    //实现消息拓展函数功能
    extension(str) {
        let res = str;
        for (let i = 16; i < 68; i++) {
            res += this.XOR(this.XOR(this.P1(this.XOR(this.XOR(res.substr((i-16)*8,8), res.substr((i - 9) * 8, 8)), this.leftShift(res.substr((i - 3) * 8, 8), 15))), this.leftShift(res.substr((i - 13) * 8, 8), 7)), res.substr((i - 6) * 8, 8));
        }

        for (let i = 0; i < 64; i++) {
            res += this.XOR(res.substr(i * 8, 8), res.substr((i + 4) * 8, 8));
        }

        return res;
    }

    //消息压缩函数
    compress(str1, str2) {
        let A1 = str1.substr(0, 8);
        let B1 = str1.substr(8, 8);
        let C1 = str1.substr(16, 8);
        let D1 = str1.substr(24, 8);
        let E1 = str1.substr(32, 8);
        let F1 = str1.substr(40, 8);
        let G1 = str1.substr(48, 8);
        let H1 = str1.substr(56, 8);
        let SS1 = "";
        let SS2 = "";
        let TT1 = "";
        let TT2 = "";
        for(let i=0; i<64; i++) {
            SS1= this.leftShift(this.modAdd(this.modAdd(this.leftShift(A1, 12), E1), this.leftShift(this.Tj(i), i)), 7);
            SS2= this.XOR(SS1, this.leftShift(A1, 12));
            TT1= this.modAdd(this.modAdd(this.modAdd(this.modAdd(this.FF(A1, B1, C1, i), D1), SS2), this.extension(str2).substr(8*i, 8)), this.Tj(i));
            TT2= this.modAdd(this.modAdd(this.modAdd(this.modAdd(this.GG(E1, F1, G1, i), H1), SS1), this.extension(str2).substr(8*i, 8)), this.Tj(i+4));
            D1=C1;
            C1= this.leftShift(B1, 9);
            B1=A1;
            A1=TT1;
            H1=G1;
    		G1 = this.leftShift(F1, 19);
		    F1 = E1;        
            E1 = this.P0(TT2);
        }
        return this.modAdd(str1, this.Bin2Hex(A1+B1+C1+D1+E1+F1+G1+H1));
    }

    //迭代压缩函数实现
    iteration(str){
        let num = str.length / 128;
        let V = "7380166F4914B2B9172442D7DA8A0600A96F30BC163138AAE38DEE4DB0FB0E4E";
        for (let i = 0; i < num; i++) {
            let  B = str.substr(i * 128, 128);
            let extensionB = this.extension(B);
            let compressB = this.compress(extensionB, V);
            V = this.XOR(V, compressB);
        }
        return V;
    }

}




    

