<template>
  <div class="loginBox">
    <el-form :model="loginInfo" :rules="loginRules" ref="loginForm">
      <!-- 头像 -->
      <el-avatar :size="110">
        <img
          src="https://img2.baidu.com/it/u=3746710106,888580210&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500"
          alt=""
        />
      </el-avatar>
      <!-- 用户名 -->
      <el-form-item prop="name">
        <el-input
          prefix-icon="el-icon-user-solid"
          v-model="loginInfo.name"
          @input="checkVaildate('loginForm')"
          placeholder="请输入用户名"
        >
        </el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="pwd">
        <el-input
          show-password
          prefix-icon="el-icon-lock"
          v-model="loginInfo.pwd"
          @input="checkVaildate('loginForm')"
          placeholder="请输入密码"
        >
        </el-input>
      </el-form-item>

      <el-form-item>
        <!-- 登录 -->
        <el-button @click="submit" type="primary" :disabled="isDisabled"
          >登录</el-button
        >
        <!-- 重置 -->
        <el-button @click="resetForm('loginForm')" type="info">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 使用图形验证码 -->
    <Vcode :show="isShow" @success="success" @close="close" />
  </div>
</template>

<script>
// 导入图形校验码组件
import Vcode from "vue-puzzle-vcode";

export default {
  props: {},
  data() {
    return {
      isDisabled: true, //登录按钮禁用
      isShow: false, // 验证码模态框是否出现
      loginInfo: {
        name: "admin",
        pwd: "123456",
      },
      loginRules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "change" },
          {
            min: 3,
            max: 6,
            message: "长度在 3 到 6 个字符",
            trigger: "change",
          },
        ],
        pwd: [
          { required: true, message: "请输入密码", trigger: "change" },
          {
            min: 6,
            max: 12,
            message: "密码长度在 6 到 12 个字符",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    // 整个表单进行校验
    checkVaildate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isDisabled = false; //解除登录按钮的禁用
        } else {
          return true;
        }
      });
    },
    // 重置按钮
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    // 验证码模态框是否出现
    submit() {
      this.isShow = true;
    },
    // 用户通过了验证
    async success(msg) {
      this.isShow = false; // 通过验证后，需要手动隐藏模态框

      // 调用登录的接口
      let res = await this.axios.post("/login", {
        username: this.loginInfo.name,
        password: this.loginInfo.pwd,
      });

      // 判断是否登录成功
      if (res.meta.status == 200) {
        // console.log(res.meta.msg);
        // 存储token
        sessionStorage.setItem("token", res.data.token);
        // 消息提示
        this.$message({
          message: res.meta.msg,
          type: "success",
          duration: 1000,
          // 当成功时 跳转到home
          onClose: () => {
            this.$router.push("/home").catch((erro) => {});
          },
        });
      } else {
        // console.log(res.meta.msg);
        this.$message.error({
          message: res.meta.msg,
          duration: 2000,
        });
      }
      // console.log('登录后的数据', res);
    },

    // 用户点击遮罩层，应该关闭模态框
    close() {
      this.isShow = false;
    },
    login() {
      this.isShow = true;
    },
  },
  components: {
    // 注册组件（验证码拖拽）
    Vcode,
  },
  // 页面加载完就进行校验
  mounted() {
    this.checkVaildate("loginForm");
  },
};
</script>

<style scoped lang="less">
.loginBox {
  width: 100%;
  height: 100%;
  // background-color: pink;
  background: url(@/assets/bj.jpg) no-repeat;
  background-size: cover;

  display: flex;
  justify-content: center;
  align-items: center;

  .el-form {
    width: 300px;
    padding: 70px 20px 0px;
    background-color: white;
    border-radius: 7px;
    text-align: right;
    position: relative;

    .el-form-item {
      margin-bottom: 20px;
    }

    .el-avatar {
      position: absolute;
      top: -23%;
      left: 50%;
      transform: translateX(-50%);
      padding: 7px;
      background-color: white;
      border: 1px solid #eee;
      box-shadow: 0 0 5px #ddd;

      img {
        border-radius: 50%;
      }
    }
  }
}
</style>
