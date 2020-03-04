<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avater_box">
        <!-- 头像区域 -->
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登录表单区 -->
      <el-form label-width="0px" :rules="loginRules" class="login_form" :model="loginForm" ref="loginFormRef">
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password" ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm('loginFormRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import api from './api.js'
export default {
  name: "Login",
  components: {},
  data(){
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ]
      }
    }
  },
//   created: {},
//   mounted: {},
  methods: {
      resetForm(formName) {
        let self = this;
        self.$refs[formName].resetFields();
      },
      login() {
          let self = this;
          self.$refs.loginFormRef.validate(valid => {
              if(!valid) return;
              api.login(self.loginForm).then(res => {
                  if(res.data && res.data.meta){
                      if(res.data.meta.status == 200){
                        self.$message({ message: '登录成功', type: 'success'  });
                        window.sessionStorage.setItem('token', res.data.data.token);
                        self.$router.push('/home')
                      }else{
                        self.$message({ message: res.data.meta.msg, type: 'warning'  });
                      }
                  } else {
                      console.log(res)
                  }
                  
              })
          })
      }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
  .login_box {
    height: 300px;
    width: 450px;
    background-color: #ffffff;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .avater_box {
      height: 130px;
      width: 130px;
      background-color: #fff;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);

      img {
        height: 130px;
        width: 130px;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .login_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      .btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>