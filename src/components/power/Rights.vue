<template>
  <div class="rights">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 用户列表区域 -->
      <el-table :data="rightsList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称" align="center"></el-table-column>
        <el-table-column prop="path" label="路径" align="center"></el-table-column>
        <el-table-column prop="level" label="权限等级" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 0" >一级</el-tag>
            <el-tag v-if="scope.row.level == 1" type="success">二级</el-tag>
            <el-tag v-if="scope.row.level == 2" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import api from "./powerApi.js";
export default {
  name: "Right",
  components: {},
  data() {
    return {
      rightsList: []
    };
  },
  created() {
    let self = this;
    self.$nextTick(() => {
      self.getRightsList();
    });
  },
  // mounted() {},
  methods: {
    getRightsList() {
      let self = this;
      api.getRightsList().then(res => {
        if (res.data && res.data.meta) {
          if (res.data.meta.status == 200) {
            self.rightsList = res.data.data;
          } else {
            self.$message({ message: res.data.meta.msg, type: "warning" });
          }
        } else {
          self.$message({ message: "系统错误", type: "error" });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>
