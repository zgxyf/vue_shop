<template>
  <div class="hello">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="searchText"
            class="input-with-select"
            clearable
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名" align="center"></el-table-column>
        <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
        <el-table-column prop="mobile" label="电话" align="center"></el-table-column>
        <el-table-column prop="role_name" label="角色" align="center"></el-table-column>
        <el-table-column prop="mg_state" label="状态" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" min-width="120px" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteUserById(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" size="mini" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        style="margin-top: 10px;text-align: left;"
      ></el-pagination>
    </el-card>

    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
      <!-- 内容主体 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
      <!-- 内容主体 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "../api.js";
export default {
  name: "Users",
  components: {},
  data() {
    var validateEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        return callback();
      } else {
        callback(new Error("请输入合法的邮箱"));
      }
    };
    var validateMobile = (rule, value, callback) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return callback();
      } else {
        callback(new Error("请输入合法的手机号"));
      }
    };
    return {
      searchText: "",
      userList: [],
      addDialogVisible: false,
      editDialogVisible: false,
      pagination: {
        currentPage: 1,
        total: 0,
        pageSizes: [10, 20, 30, 40],
        pageSize: 10
      },
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      editForm: {},
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: validateEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: validateMobile, trigger: "blur" }
        ]
      },
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: validateEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: validateMobile, trigger: "blur" }
        ]
      }
    };
  },
  //   created() {},
  mounted() {
    let self = this;
    // self.getUserList();
    self.$nextTick(() => {
      self.getUserList();
    });
  },
  methods: {
    addDialogClose() {
      let self = this;
      self.$refs["addFormRef"].resetFields();
    },
    editDialogClose() {
      let self = this;
      self.$refs["editFormRef"].resetFields();
    },
    handleSizeChange(val) {
      let self = this;
      self.pagination.pageSize = val;
      self.pagination.currentPage = 1;
      self.getUserList();
    },
    handleCurrentChange(val) {
      let self = this;
      self.pagination.currentPage = val;
      self.getUserList();
    },
    userStateChange(userinfo) {
      // 改变用户状态
      let self = this;
      api.updateUserState(userinfo).then(res => {
        if (res.data && res.data.meta) {
          if (res.data.meta.status == 200) {
            self.$message({ message: res.data.meta.msg, type: "success" });
          } else {
            self.$message({ message: res.data.meta.msg, type: "warning" });
            userinfo.mg_stats = !userinfo.mg_stats;
          }
        } else {
          self.$message({ message: "系统错误", type: "error" });
          userinfo.mg_stats = !userinfo.mg_stats;
        }
      });
    },
    getUserList() {
      let self = this;
      let params = {
        query: self.searchText,
        pagenum: self.pagination.currentPage,
        pagesize: self.pagination.pageSize
      };
      api.getUserList(params).then(res => {
        if (res.data && res.data.meta) {
          if (res.data.meta.status == 200) {
            self.userList = res.data.data.users;
            self.pagination.total = res.data.data.total;
          } else {
            self.$message({ message: res.data.meta.msg, type: "warning" });
          }
        } else {
          self.$message({ message: "系统错误", type: "error" });
        }
      });
    },
    addUser() {
      // 添加用户
      let self = this;
      self.$refs["addFormRef"].validate(valid => {
        if (!valid) return;
        api.addUser(self.addForm).then(res => {
          if (res.data && res.data.meta) {
            if (res.data.meta.status == 201) {
              self.$message({ message: res.data.meta.msg, type: "success" });
              self.addDialogVisible = false;
              self.getUserList();
            } else {
              self.$message({ message: res.data.meta.msg, type: "warning" });
            }
          } else {
            self.$message({ message: "系统错误", type: "error" });
          }
        });
      });
    },
    editUser() {
      // 修改用户
      let self = this;
      self.$refs["editFormRef"].validate(valid => {
        if (!valid) return;
        api.editUser(self.editForm).then(res => {
          if (res.data && res.data.meta) {
            if (res.data.meta.status == 200) {
              self.$message({ message: res.data.meta.msg, type: "success" });
              self.editDialogVisible = false;
              self.getUserList();
            } else {
              self.$message({ message: res.data.meta.msg, type: "warning" });
            }
          } else {
            self.$message({ message: "系统错误", type: "error" });
          }
        });
      });
    },
    showEditDialog(id) {
      // 修改用户信息，查询用户信息
      let self = this;
      api.getUserInfoById(id).then(res => {
        if (res.data && res.data.meta) {
          if (res.data.meta.status == 200) {
            self.editForm = res.data.data;
            self.editDialogVisible = true;
          } else {
            self.$message({ message: res.data.meta.msg, type: "warning" });
          }
        } else {
          self.$message({ message: "系统错误", type: "error" });
        }
      });
    },
    deleteUserById(id) {
      // 删除用户
      let self = this;
      // 弹框，提示
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          api.deleteUserById(id).then(res => {
            if (res.data && res.data.meta) {
              if (res.data.meta.status == 200) {
                self.$message({ message: res.data.meta.msg, type: "success" });
                self.getUserList();
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
    }
  }
};
</script>

<style lang="less" scoped>
h3 {
  margin: 40px 0 0;
}
</style>
