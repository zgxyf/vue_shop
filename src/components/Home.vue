<template>
  <el-container class="home-container">
    <el-header>
      <div class="header-logo">
        <img src="../assets/header-logo.png" alt />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="loginout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-botton" @click="toggleCollapse">|||</div>
        <el-menu class="el-menu-vertical-demo" background-color="#333744" text-color="#fff" active-text-color="#409eff"
         :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" :router="true" 
         :default-active="activePath">

          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState(subItem.path)">
              <!-- 二级菜单模板区域 -->
              <template slot="title">
                <!-- 二级菜单图标 -->
                <i class="el-icon-menu"></i>
                <!-- 二级菜单文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
          
        </el-menu>
      </el-aside>

      <!-- 右侧主体内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import api from './api.js'
export default {
  name: "Home",
  components: {},
  data() {
    return {
      menuList: [],
      iconObj: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
    };
  },
  created() {
    let self = this;
    // self.getMenuList()
    self.$nextTick(() => {
      self.getMenuList()
      self.activePath = window.sessionStorage.getItem('activePath')
    })
  },
  mounted() {
    // let self = this;
    // self.getMenuList()
  },
  methods: {
    loginout() {
      let self = this;
      window.sessionStorage.clear();
      self.$router.push("/login");
    },
    getMenuList() {
      let self = this;
      api.getMenuList().then(res => {
        if (res.data && res.data.meta) {
          if (res.data.meta.status == 200) {
            self.menuList = res.data.data
          } else {
            self.$message({ message: res.data.meta.msg, type: "warning" });
          }
        } else {
          self.$message({ message: "系统错误", type: "error" });
        }
      });
    },
    toggleCollapse() {
      // 菜单折叠和展开
      let self = this;
      self.isCollapse = !self.isCollapse
    },
    saveNavState(activePath) {
      // 保存连接的激活状态
      let self = this;
      window.sessionStorage.setItem('activePath', activePath)
      self.activePath = activePath
    }
  }
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    .header-logo {
      display: flex;
      align-items: center;
      span {
        padding-left: 15px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    .toggle-botton {
      background-color: #4a5064;
      font-size: 10px;
      text-align: center;
      line-height: 24px;
      color: #fff;
      letter-spacing: 0.2em;
      cursor: pointer;
    }
    .el-menu {
      border-right: none;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
.iconfont {
 margin-right: 10px
}
</style>
