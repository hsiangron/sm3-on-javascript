export class _math {
    constructor(){}
    //2->16
    bin2Hex(str) {
        let hex = "";
        let temp = 0;
    
        while (str.length % 4 !== 0) {
            str = "0" + str;
        }
    
        for (let i = 0; i < str.length; i += 4) {
        temp =(str[i] - "0") * 8 + (str[i + 1] - "0") * 4 + (str[i + 2] - "0") * 2 + (str[i + 3] - "0") * 1; // 判断出4位二进制数的十进制大小为多少
        if (temp < 10) 
            hex += temp.toString();
        else
            hex += String.fromCharCode("A".charCodeAt(0) + (temp - 10));
        }
        return hex;
    }

    //16->2   
    hex2Bin(str) {
        var bin = "";
        var table = ["0000", "0001", "0010", "0011", "0100", "0101", "0110", "0111", "1000", "1001", "1010", "1011", "1100", "1101", "1110", "1111"];
        for (var i = 0; i < str.length; i++) {
            if (str[i] >= 'A' && str[i] <= 'F') {
                bin += table[str[i].charCodeAt(0) - 'A'.charCodeAt(0) + 10];
            } else {
                bin += table[str[i].charCodeAt(0) - '0'.charCodeAt(0)];
            }
        }
        return bin;
    }

    //10->16
    dec2Hex(str) {
        let hex = "";
        let temp = 0;
        while (str >= 1) {
          temp = str % 16;
          if (temp < 10 && temp >= 0) {
            hex = temp.toString() + hex;
          } else {
            hex += String.fromCharCode('A'.charCodeAt(0) + (temp - 10));
          }
          str = Math.floor(str / 16);
        }
        return hex;
    }

    xor(str1, str2) {
        let res1 = this.hex2Bin(str1);
        let res2 = this.hex2Bin(str2);
        let res = "";
        for (let i = 0; i < res1.length; i++) {
            if (res1[i] === res2[i]) {
                res += "0";
            } else {
                res += "1";
            }
        }
        return this.bin2Hex(res);
    }

    and(str1, str2) {
        let res1 = this.hex2Bin(str1);
        let res2 = this.hex2Bin(str2);
        let res = "";
        for (let i = 0; i < res1.length; i++) {
            if (res1[i] === '1' && res2[i] === '1')
                res += "1";
            else
                res += "0";
        }
        return this.bin2Hex(res);
    }

    or(str1, str2) {
        let res1 = this.hex2Bin(str1);
        let res2 = this.hex2Bin(str2);
        let res = "";
        for (let i = 0; i < res1.length; i++) {
            if (res1[i] === '0' && res2[i] === '0')
                res += "0";
            else
                res += "1";
        }
        return this.bin2Hex(res);
    }

    not(str) {
        let res1 = this.hex2Bin(str);
        let res = "";
        for (let i = 0; i < res1.length; i++) {
            if (res1[i] === '0')
                res += "1";
            else
                res += "0";
        }
        return this.bin2Hex(res);
    }  
}