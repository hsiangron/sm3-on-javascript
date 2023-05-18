// 以下是SM3的一个使用实例，用于计算字符串"fudan"的SM3值
import { _sm3 } from "../core/_sm3.js";

//明文msg，接收密文的对象md
let msg = "fudan";
let sm3 = new _sm3();
let md = {str:""};

//sm3加密
sm3.sm3_init(sm3.ctx);  
sm3.sm3_update(sm3.ctx, msg, msg.length);
sm3.sm3_final(md, sm3.ctx);

//输出密文md.str
console.log("SM(\"" + msg +"\") = " + md.str);