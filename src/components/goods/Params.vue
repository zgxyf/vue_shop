<template>
  <div class="params">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon></el-alert>

      <!-- 选中商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            :clearable="true"
            v-model="selectKeys"
            :options="cateList"
            :props="cascaderProp"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
          >添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(tag, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleTagClose(scope.row, i)"
                >{{tag}}</el-tag>
                <!-- 添加标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="deleteParamById((scope.row.attr_id))"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
          >添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(tag, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleTagClose(scope.row, i)"
                >{{tag}}</el-tag>
                <!-- 添加标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="deleteParamById((scope.row.attr_id))"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- 添加属性对话框 -->
      <el-dialog
        :title="'添加' + titleText"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="handleClose"
      >
        <el-form
          :model="addParamForm"
          :rules="addParamFormRules"
          ref="addParamFormRef"
          label-width="100px"
        >
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="addParamForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParam">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改参数对话框 -->
      <el-dialog
        :title="'修改' + titleText"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="handleEditClose"
      >
        <el-form
          :model="editParamForm"
          :rules="editParamFormRules"
          ref="editParamFormRef"
          label-width="100px"
        >
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editParamForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParam">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import api from "./goodsApi.js";
export default {
  name: "Params",
  components: {},
  data() {
    return {
      cateList: [],
      selectKeys: "",
      cascaderProp: {
        expandTrigger: "hover",
        // 指定你具体选中的选项的  值
        value: "cat_id",
        // 指定你看到的属性
        label: "cat_name",
        children: "children"
      },
      // 被激活页签的名字
      activeName: "many",
      manyTableData: [],
      onlyTableData: [],
      addDialogVisible: false,
      editDialogVisible: false,
      addParamForm: {
        attr_name: "",
        attr_sel: "",
        attr_vals: ""
      },
      editParamForm: {
        attr_name: "",
        attr_sel: "",
        attr_vals: ""
      },

      // 参数校验
      addParamFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ]
      },
      editParamFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
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
    // 获取商品分类数据
    getCateList() {
      let self = this;
      let params = {};
      api.getCateList(params).then(res => {
        if (res.data && res.data.meta) {
          if (res.data.meta.status == 200) {
            self.cateList = res.data.data;
          } else {
            self.$message({ message: res.data.meta.msg, type: "warning" });
          }
        } else {
          self.$message({ message: "系统错误", type: "error" });
        }
      });
    },
    // 下拉框级联选择改变事件
    handleChange() {
      let self = this;
      if (self.selectKeys.length != 3) {
        self.selectKeys = [];
        self.manyTableData = [];
        self.onlyTableData = [];
        return;
      }
      // 根据所选的ID和当前面板，获取对应数据
      let params = { sel: self.activeName };
      api.getAttributes(self.cateId, params).then(res => {
        if (res.data && res.data.meta) {
          if (res.data.meta.status == 200) {
            res.data.data.forEach(element => {
              element.attr_vals = element.attr_vals
                ? element.attr_vals.split(" ")
                : [];
              element.inputVisible = false;
              element.inputValue = "";
            });
            if (self.activeName == "many") {
              self.manyTableData = res.data.data;
            } else {
              self.onlyTableData = res.data.data;
            }
          } else {
            self.$message({ message: res.data.meta.msg, type: "warning" });
          }
        } else {
          self.$message({ message: "系统错误", type: "error" });
        }
      });
    },
    // tab页签点击事件处理
    handleClick() {
      let self = this;
      self.handleChange();
    },
    handleClose() {
      let self = this;
      self.$refs["addParamFormRef"].resetFields();
    },
    handleEditClose() {
      let self = this;
      self.$refs["editParamFormRef"].resetFields();
    },
    addParam() {
      let self = this;
      self.$refs.addParamFormRef.validate(valid => {
        if (!valid) return;
        self.addParamForm.attr_sel = self.activeName;
        api.addParam(self.cateId, self.addParamForm).then(res => {
          if (res.data && res.data.meta) {
            if (res.data.meta.status == 201) {
              self.$message({ message: res.data.meta.msg, type: "success" });
              self.handleChange();
              self.addDialogVisible = false;
            } else {
              self.$message({ message: res.data.meta.msg, type: "warning" });
            }
          } else {
            self.$message({ message: "系统错误", type: "error" });
          }
        });
      });
    },
    showEditDialog(attrId) {
      let self = this;
      let params = { attr_sel: self.activeName };
      api.getParamById(self.cateId, attrId, params).then(res => {
        if (res.data && res.data.meta) {
          if (res.data.meta.status == 200) {
            self.editParamForm = res.data.data;
            self.editDialogVisible = true;
          } else {
            self.$message({ message: res.data.meta.msg, type: "warning" });
          }
        } else {
          self.$message({ message: "系统错误", type: "error" });
        }
      });
    },
    editParam() {
      let self = this;
      self.$refs.editParamFormRef.validate(valid => {
        if (!valid) return;
        self.editParamForm.attr_sel = self.activeName;
        api.editParam(self.cateId, self.editParamForm).then(res => {
          if (res.data && res.data.meta) {
            if (res.data.meta.status == 200) {
              self.$message({ message: res.data.meta.msg, type: "success" });
              self.handleChange();
              self.editDialogVisible = false;
            } else {
              self.$message({ message: res.data.meta.msg, type: "warning" });
            }
          } else {
            self.$message({ message: "系统错误", type: "error" });
          }
        });
      });
    },
    deleteParamById(attrId) {
      let self = this;
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api.deleteParamById(self.cateId, attrId).then(res => {
            if (res.data && res.data.meta) {
              if (res.data.meta.status == 200) {
                self.$message({ message: res.data.meta.msg, type: "success" });
                self.handleChange();
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
    // 添加标签
    showInput(tagItem) {
      tagItem.inputVisible = true;
      // 让文本框获取焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm(tagItem) {
      let self = this;
      if (tagItem.inputValue.trim().length == 0) {
        tagItem.inputValue = "";
        tagItem.inputVisible = false;
        return;
      }
      // 新增标签
      tagItem.attr_vals.push(tagItem.inputValue.trim());
      tagItem.inputValue = "";
      tagItem.inputVisible = false;
      self.editParamTag(tagItem);
    },
    editParamTag(tagItem) {
      let self = this;
      let params = {
        attr_id: tagItem.attr_id,
        attr_name: tagItem.attr_name,
        attr_sel: tagItem.attr_sel,
        attr_vals: tagItem.attr_vals.join(" ")
      };
      api.editParam(self.cateId, params).then(res => {
        if (res.data && res.data.meta) {
          if (res.data.meta.status == 200) {
            self.$message({ message: res.data.meta.msg, type: "success" });
          } else {
            self.$message({ message: res.data.meta.msg, type: "warning" });
          }
        } else {
          self.$message({ message: "系统错误", type: "error" });
        }
      });
    },
    // 删除标签
    handleTagClose(tagItem, index) {
      let self = this;
      // 删除数组里的标签
      tagItem.attr_vals.splice(index, 1);
      // 发起重新保存tsg请求
      self.editParamTag(tagItem);
    }
  },
  computed: {
    isBtnDisabled() {
      if (this.selectKeys.length == 3) {
        return false;
      } else {
        return true;
      }
    },
    cateId() {
      if (this.selectKeys.length == 3) {
        return this.selectKeys[2];
      } else {
        return null;
      }
    },
    titleText() {
      if (this.activeName == "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    }
  }
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 0 5px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
