import { Toast } from 'vant';
// FormValidation
class ValidForm {

  constructor() {

    this.validUserFormReg = {

      //昵称， 1-10个字符, 汉字字母数字_组合
      nickName: {
        reg: /^[\u4e00-\u9fa5\w]{1,8}$/,
        msg: '昵称格式不正确...'
      },

      //手机号
      phone: {
        reg: /^(\+86)?1[3|4|5|7|8]\d{9}$/i,
        msg: '请输入正确的手机号码...'
      },

      //密码
      password: {
        reg: /^[a-zA-Z]\w{5,16}/i,// 首字符为字母+其他
        msg: '密码要以英文字母开头，6~16位...'
      }
    }
  }

  // // 2验证用户信息
  // // vant框架-Toast弹出提示→$toast
  // validUserForm(o, self) {
  //     // o：表单数据，类型是object对象
  //     // self：因为这里的this是指向构造函数constructor的，但是constructor这个类里面没有Toast(this.$toast)，要想使用$toast，那就传个参数→self
  //     // validUserFormReg[key]→validUserFormReg[0]→nickName
  //     // o[key]→o[0]→nickName的值
  //     for (let key in o) {
  //         if (!this.validUserFormReg[key].reg.test(o[key])) {
  //             self.$toast(this.validUserFormReg[key].msg);
  //             return false;
  //         }
  //     }
  //     //表单验证通过
  //     return true;
  // }

  // 优化↓
  // 在这里导入vant框架后的写法
  // 然后在Register.vue文件中的传参方式也要改写一下
  validUserForm(o) {
    for (let key in o) {
      if (!this.validUserFormReg[key].reg.test(o[key])) {
        Toast(this.validUserFormReg[key].msg);
        return false;
      }
    }
    return true;
  }
}

// 3导出
export default new ValidForm();