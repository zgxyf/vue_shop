<template>
  <div class="cate">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 添加角色区域 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <zk-table
        style="margin-top:15px"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
      >
        <template slot="isOk" scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted == false" style="color:green"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <template slot="order" scope="scope">
          <el-tag v-if="scope.row.cat_level == 0" size="mini">一级</el-tag>
          <el-tag v-if="scope.row.cat_level == 1" type="success" size="mini">二级</el-tag>
          <el-tag v-if="scope.row.cat_level == 2" type="warning" size="mini">三级</el-tag>
        </template>
        <template slot="operator" scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="showEditDialog(scope.row.cat_id)"
          >编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="deleteCateById(scope.row.cat_id)"
          >删除</el-button>
        </template>
      </zk-table>
      <!-- 分页 -->
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
      <!-- 对话框 -->
      <!-- 添加分类对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="50%"
        @close="addCateDialogClose"
      >
        <el-form
          :model="addCateForm"
          :rules="addCateFormRules"
          ref="addCateFormRef"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类" prop="password">
            <!-- props 配置选项 -->
            <el-cascader
              :clearable="true"
              style="width:100%"
              v-model="selectKeys"
              :options="parentCateList"
              :props="cascaderProp"
              @change="parentCateChange"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改分类对话框 -->
      <el-dialog
        title="修改分类"
        :visible.sync="editCateDialogVisible"
        width="50%"
        @close="editCateClose"
      >
        <el-form
          :model="editCateForm"
          :rules="editCateFormRules"
          ref="editCateFormRef"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editCateForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCate">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import api from "./goodsApi.js";
export default {
  name: "Cate",
  components: {},
  data() {
    return {
      addCateDialogVisible: false,
      editCateDialogVisible: false,
      parentCateList: [],
      cascaderProp: {
        expandTrigger: "hover",
        // 指定你具体选中的选项的  值
        value: "cat_id",
        // 指定你看到的属性
        label: "cat_name",
        children: "children",
        checkStrictly: true
      },
      selectKeys: [],
      // 添加分类
      addCateForm: {
        // 默认分类父ID是0
        cat_pid: 0,
        cat_name: "",
        // 默认添加分类 1级分类
        cat_level: 0
      },
      editCateForm: {
        cat_name: ""
      },
      cateList: [],
      pagination: {
        currentPage: 1,
        total: 0,
        pageSizes: [5, 10, 20, 40],
        pageSize: 5
      },
      // 为table指定列
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          // 当前列定义为模板列
          type: "template",
          template: "isOk"
        },
        {
          label: "排序",
          type: "template",
          template: "order"
        },
        {
          label: "操作",
          type: "template",
          template: "operator"
        }
      ],
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      editCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    let self = this;
    self.$nextTick(() => {
      self.getCateList();
    });
  },
  // mounted() {},
  methods: {
    handleSizeChange(val) {
      let self = this;
      self.pagination.pageSize = val;
      self.pagination.currentPage = 1;
      self.getCateList();
    },
    handleCurrentChange(val) {
      let self = this;
      self.pagination.currentPage = val;
      self.getCateList();
    },
    // 获取商品分类数据
    getCateList() {
      let self = this;
      let params = {
        type: 3,
        pagenum: self.pagination.currentPage,
        pagesize: self.pagination.pageSize
      };
      api.getCateList(params).then(res => {
        if (res.data && res.data.meta) {
          if (res.data.meta.status == 200) {
            self.cateList = res.data.data.result;
            self.pagination.total = res.data.data.total;
          } else {
            self.$message({ message: res.data.meta.msg, type: "warning" });
          }
        } else {
          self.$message({ message: "系统错误", type: "error" });
        }
      });
    },
    showAddCateDialog() {
      let self = this;
      self.addCateDialogVisible = true;
      let params = {
        type: 2
      };
      api.getCateList(params).then(res => {
        if (res.data && res.data.meta) {
          if (res.data.meta.status == 200) {
            self.parentCateList = res.data.data;
          } else {
            self.$message({ message: res.data.meta.msg, type: "warning" });
          }
        } else {
          self.$message({ message: "系统错误", type: "error" });
        }
      });
    },
    parentCateChange() {
      let self = this;
      if (self.selectKeys.length > 0) {
        // 父级分类ID
        self.addCateForm.cat_pid = self.selectKeys[self.selectKeys.length - 1];
        self.addCateForm.cat_level = self.selectKeys.length;
      } else {
        self.addCateForm.cat_pid = 0;
        self.addCateForm.cat_level = 0;
      }
    },
    addCate() {
      let self = this;
      self.$refs.addCateFormRef.validate(valid => {
        if (!valid) return;
        api.addCate(self.addCateForm).then(res => {
          if (res.data && res.data.meta) {
            if (res.data.meta.status == 201) {
              self.$message({ message: res.data.meta.msg, type: "success" });
              self.getCateList();
              self.addCateDialogVisible = false;
            } else {
              self.$message({ message: res.data.meta.msg, type: "warning" });
            }
          } else {
            self.$message({ message: "系统错误", type: "error" });
          }
        });
      });
    },
    addCateDialogClose() {
      let self = this;
      self.$refs["addCateFormRef"].resetFields();
      self.selectKeys = [];
      self.addCateForm.cat_pid = 0;
      self.addCateForm.cat_level = 0;
    },
    showEditDialog(id) {
      let self = this;
      api.getCateById(id).then(res => {
        if (res.data && res.data.meta) {
          if (res.data.meta.status == 200) {
            self.editCateForm = res.data.data;
            self.editCateDialogVisible = true;
          } else {
            self.$message({ message: res.data.meta.msg, type: "warning" });
          }
        } else {
          self.$message({ message: "系统错误", type: "error" });
        }
      });
    },
    editCate() {
      let self = this;
      self.$refs.editCateFormRef.validate(valid => {
        if (!valid) return;
        api.editCate(self.editCateForm.cat_id, self.editCateForm).then(res => {
          if (res.data && res.data.meta) {
            if (res.data.meta.status == 200) {
              self.$message({ message: res.data.meta.msg, type: "success" });
              self.getCateList();
              self.editCateDialogVisible = false;
            } else {
              self.$message({ message: res.data.meta.msg, type: "warning" });
            }
          } else {
            self.$message({ message: "系统错误", type: "error" });
          }
        });
      });
    },
    deleteCateById(id) {
      let self = this;
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api.deleteCateById(id).then(res => {
            if (res.data && res.data.meta) {
              if (res.data.meta.status == 200) {
                self.$message({ message: res.data.meta.msg, type: "success" });
                self.getCateList();
              } else {
                self.$message({ message: res.data.meta.msg, type: "warning" });
              }
            } else {
              self.$message({ message: "系统错误", type: "error" });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    editCateClose() {
      let self = this;
      self.$refs["editCateFormRef"].resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
</style>
