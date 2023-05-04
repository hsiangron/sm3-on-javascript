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

    
}

