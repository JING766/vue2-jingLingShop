<template>
  <div class="homeBox">
    <el-container>
      <!-- 头部导航栏 -->
      <el-header>
        <div class="left">
          <img
            @click="goHome"
            src="@/assets/jingling_logo.0ada255b.png"
            alt=""
          />
          <span>精灵购物平台管理系统</span>
        </div>
        <div class="right">
          <el-popconfirm
            @confirm="loginOut"
            title="是否确认退出?"
            icon-color="red"
          >
            <el-button type="info" slot="reference">退出</el-button>
          </el-popconfirm>
        </div>
      </el-header>
      <el-container class="main">
        <!-- 侧边栏菜单 -->
        <el-aside width="auto">
          <!-- 菜单折叠与展开 -->
          <div class="toggle-button" @click="toggleCollapse">|||</div>

          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            background-color="#303641"
            text-color="#fff"
            active-text-color="#409EFF"
            unique-opened
            router
            :collapse-transition="false"
            :collapse="isCollapse"
          >
            <el-submenu
              :index="item.id.toString()"
              v-for="(item, index) in meunList"
              :key="item.id"
            >
              <template slot="title">
                <i :class="icons[index]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <el-menu-item
                v-for="childItem in item.children"
                :key="childItem.id"
                :index="childItem.id.toString()"
                :route="{ path: '/home/' + childItem.path }"
              >
                <i class="el-icon-menu"></i>
                {{ childItem.authName }}
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>

        <!-- 主体 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      meunList: [],
      icons: [
        "el-icon-s-goods",
        "el-icon-s-help",
        "el-icon-s-cooperation",
        // 'el-icon-s-goods',
        "el-icon-s-shop",
        "el-icon-s-claim",
      ],

      isCollapse: false, // 菜单折叠与展开
    };
  },
  methods: {
    // 点击图标回到首页
    goHome() {
      // console.log('点击');
      this.$router.push("/home").catch((erro) => {});
    },

    // 退出登录
    loginOut() {
      // console.log('确定退出');
      sessionStorage.removeItem("token");
      this.$router.push("/login").catch((erro) => {});
    },

    // 获取菜单
    async getMenus() {
      let res = await this.axios.get("/menus");
      // console.log(res);
      this.meunList = res.data;
    },

    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
  components: {},
  mounted() {
    this.getMenus();
  },
};
</script>

<style scoped lang="less">
.homeBox {
  width: 100%;
  height: 100%;
  background-color: gray;
  color: white;

  .el-container {
    height: 100%;

    // 头部导航栏
    .el-header {
      background-color: #353c3e;

      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        display: flex;
        align-items: center;

        img {
          width: 50px;

          &:hover {
            cursor: pointer;
          }
        }

        span {
          color: white;
          font-size: 20px;
          letter-spacing: 3px;
          margin-left: 20px;

          &:hover {
            cursor: default;
          }
        }
      }

      .right {
        // background-color: orange;
        &:hover {
          cursor: pointer;
        }

        .el-popconfirm {
          width: 50px;
          height: 50px;
          background-color: grey;

          .el-button {
            color: #fff;
            background-color: #909399;
            border-color: #909399;
          }
        }
      }
    }

    .main {
      height: 100%;
      // background-color: pink;
      background: url(@/assets/bj.jpg) no-repeat;

      // 侧边栏菜单
      .el-aside {
        height: 100%;
        background-color: #303641;

        .el-menu {
          border: none;
        }

        // 菜单折叠与展开
        .toggle-button {
          background-color: #4a5064;
          font-size: 10px;
          line-height: 24px;
          color: #fff;
          text-align: center;
          letter-spacing: 0.2em;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
