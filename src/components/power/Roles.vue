<template>
  <div class="roles">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 添加角色区域 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="rolesList" style="width: 100%" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1, i1) in scope.row.children"
              :key="item1.id" :class="['bdbottom', i1 == 0 ? 'bdtop' : '', 'vcenter']" >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{ item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二三级 -->
              <el-col :span="19">
                <!-- 通过for循环 嵌套循环二级权限 -->
                <el-row v-for="(item2, i2) in item1.children" :key="item2.id" :class="[ i2 == 0 ? '' :'bdtop', 'vcenter']">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{ item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag closable type="warning" v-for="(item3, i3) in item2.children" 
                     :key="item3.id" @close="removeRightById(scope.row, item3.id)">{{ item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" align="center"></el-table-column>
        <el-table-column prop label="操作" min-width="120px" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting" @click="showSetRightDailog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" >
      <!-- 权限树 -->
      <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" :default-expand-all="true"  
      :default-checked-keys="defKeys" ref="treeRef"></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "./powerApi.js";
export default {
  name: "Roles",
  components: {},
  data() {
    return {
      rolesList: [],
      setRightDialogVisible: false,
      rightsList: [],
      // 树形控件树形绑定
      treeProps: {children: 'children', label: 'authName'},
      defKeys: [],
      currentRoleId: ''
    };
  },
  created() {
    let self = this;
    self.$nextTick(() => {
      self.getRolesList();
    });
  },
  // mounted() {},
  methods: {
    getRolesList() {
      let self = this;
      api.getRolesList().then(res => {
        if (res.data && res.data.meta) {
          if (res.data.meta.status == 200) {
            self.rolesList = res.data.data;
          } else {
            self.$message({ message: res.data.meta.msg, type: "warning" });
          }
        } else {
          self.$message({ message: "系统错误", type: "error" });
        }
      });
    },
    removeRightById(role, rightId) {
      // 弹框提示用户是否删除
      let self = this;
      // 弹框，提示
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          api.removeRightById(role.id, rightId).then(res => {
            if (res.data && res.data.meta) {
              if (res.data.meta.status == 200) {
                self.$message({ message: res.data.meta.msg, type: "success" });
                //self.getRolesList();
                role.children = res.data.data;
              } else {
                self.$message({ message: res.data.meta.msg, type: "warning" });
              }
            } else {
              self.$message({ message: "系统错误", type: "error" });
            }
          });
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    showSetRightDailog(node) {
      // 展示分配角色
      let self = this;
      // 获取权限数据
      api.getRightsTree().then(res => {
        if (res.data && res.data.meta) {
          if (res.data.meta.status == 200) {
            // 获取到的权限树
            self.rightsList = res.data.data;
          } else {
            self.$message({ message: res.data.meta.msg, type: "warning" });
          }
        } else {
          self.$message({ message: "系统错误", type: "error" });
        }
      });
      self.defKeys = []
      self.getLeafKeys(node, self.defKeys)
      self.currentRoleId = node.id
      self.setRightDialogVisible = true;
    },
    getLeafKeys(node, arr) {
      // 通过递归获取3级权限ID
      if(!node.children){return arr.push(node.id)}
      node.children.forEach(element => {
        this.getLeafKeys(element, arr)
      });
    },
    allotRights() {
      // 角色授权
      let self = this;
      let tree = self.$refs.treeRef
      let params = {"rids": tree.getCheckedKeys() + ',' + tree.getHalfCheckedKeys()}
      api.allotRights(self.currentRoleId, params).then(res => {
        if (res.data && res.data.meta) {
          if (res.data.meta.status == 200) {
            // 权限更新成功
            self.$message({ message: res.data.meta.msg, type: "success" });
            self.setRightDialogVisible = false
            self.getRolesList()
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
.roles {
  .el-tag {
    margin: 7px;
  }
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>
