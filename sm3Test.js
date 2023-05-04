import {SM3} from './core/sm3.js';

/*
一个测试样例
输入：helloworld
输出：c70c5f73da4e8b8b73478af54241469566f6497e16c053a03a0170fa00078283
*/

let sm3 = new SM3();
let msg = "helloworld";
let hash = sm3.sm3(msg);
console.log(hash); // "66C7F0F4B9E9755B9F2D6AEFFB8BAA0B8D1F6AB8"


