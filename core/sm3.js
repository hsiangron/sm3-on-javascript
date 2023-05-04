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
        for (let i = 0; i < str.length; i += 2) {
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


}

