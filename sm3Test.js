import { SM3 } from './core/sm3.js';

/*
一个测试样例
输入：helloworld
输出：c70c5f73da4e8b8b73478af54241469566f6497e16c053a03a0170fa00078283
*/
let sm3 = new SM3();
let str = "helloworld";
for (let num = 0; num < 2; num++) {
		let paddingValue = sm3.padding(str[num]);
		let result = sm3.iteration(paddingValue);
		cout << "hash:" << endl;
		for (let i = 0; i < 8; i++) {
			console.log(result.substr(i * 8, 8));
		}
}

