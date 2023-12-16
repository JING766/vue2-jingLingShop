<template>
  <div>
    <!-- Breadcrumb面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <el-row>
        <!-- 添加信息的会话框 -->
        <el-button type="primary" @click="showAddCateDialog"
          >添加用户</el-button
        >
      </el-row>

      <!-- 商品列表表格 -->
      <tree-table
        class="treeTable"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: lightgreen"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditDialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="editDelete(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 点击添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <!-- 级联选择器  options：指定数据源 -->
          <!-- props 用来指定配置对象 -->
          <el-cascader
            expand-trigger="hover"
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
            change-on-select
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑按钮对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolesInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      input: "",
      // 从后台请求的商品列表数据
      catelist: [],
      // 列表参数
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 3,
      },
      // 总页数
      total: 0,

      // 为table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
          // width: '400px',
        },
        {
          label: "是否有效",
          // 表示，将当前列定义为模板列
          type: "template",
          // 表示当前这一列使用模板名称
          template: "isok",
        },
        {
          label: "排序",
          // 表示，将当前列定义为模板列
          type: "template",
          // 表示当前这一列使用模板名称
          template: "order",
        },
        {
          label: "操作",
          // 表示，将当前列定义为模板列
          type: "template",
          // 表示当前这一列使用模板名称
          template: "opt",
        },
      ],

      // 1、添加分类的对话框
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 要添加的分类的名称
        cat_name: "",
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级 默认一级分类
        cat_level: 0,
      },
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
        cat_pid: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 选中的父级分类的ID数组
      selectedKeys: [],

      // 2、点击修改分类的对话框
      editDialogVisible: false,
      editForm: {
        // // 要修改的分类的名称
        // cat_name: '',
      },
      // 修改分类表单的验证规则对象
      editFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 获取列表数据 （渲染数据）
    async getCategories() {
      let res = await this.axios.get("categories", { params: this.querInfo });
      if (res.meta.status != 200) {
        // console.log('ffff');
        throw new Error(res.meta.msg);
      }
      // console.log(res.data.result);
      this.catelist = res.data.result;
      // 分页总数据条数
      this.total = res.data.total;
    },

    // 分页方法
    handleSizeChange(val) {
      this.querInfo.pagesize = val;
      this.getCategories();
    },
    handleCurrentChange(val) {
      this.querInfo.pagenum = val;
      this.getCategories();
    },

    // 1、点击添加用户,，展示添加分类的对话框
    showAddCateDialog() {
      // 获取父级分类的数据列表
      this.getParentCateList();
      // 显示对话框
      this.addCateDialogVisible = true;
    },

    // 获取父级分类的数据列表
    async getParentCateList() {
      let res = await this.axios.get("categories", { params: { type: 2 } });
      if (res.meta.status != 200) {
        // console.log('ffff');
        throw new Error(res.meta.msg);
      }
      // console.log(res.data);
      this.parentCateList = res.data;
    },

    // 选择项发生变化触发这个函数
    parentCateChanged() {
      // console.log(this.selectedKeys);

      // 如果selectedKeys 数组中的 length 大于0，证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1];
        // 为当前的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        // 父级分类的id
        this.addCateForm.cat_pid = 0;
        // 为当前的等级赋值
        this.addCateForm.cat_level = 0;
      }
    },

    // 点击按钮，添加新的分类
    addCate() {
      // console.log(this.addCateForm);
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;
        let res = await this.axios.post("categories", this.addCateForm);
        // console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("添加分类失败!");
        }

        this.$message.success("添加分类成功!");
        // 刷新数据列表
        this.getCategories();
        // 隐藏对话框
        this.addCateDialogVisible = false;
      });
    },

    // 监听对话框的关闭事件，重置表单数据
    addCateDialogClosed() {
      // 表单
      this.$refs.addCateFormRef.resetFields();
      // 级联选择器清空
      this.selectedKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },

    // 2、点击编辑按钮修改商品
    async showEditDialog(id) {
      //   console.log(id);
      let res = await this.axios.get("categories/" + id);
      if (res.meta.status != 200) {
        return this.$message.error("查询商品信息失败！");
      }
      this.editForm = res.data;
      //   console.log(this.editForm);
      // 显示修改用户对话框
      this.editDialogVisible = true;
    },
    // 监听添加用户对话框的关闭事件
    editDialogClosed() {
      // 当添加信息对话框关闭时清空已填内容
      this.$refs.editFormRef.resetFields();
    },
    // 点击确定按钮 修改用户信息并验证
    editRolesInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) return;
        // 发起修改用户信息的数据请求
        let res = await this.axios.put("categories/" + this.editForm.cat_id, {
          cat_name: this.editForm.cat_name,
        });

        if (res.meta.status !== 200) {
          return this.$message.error("更新商品信息失败!");
        }
        // console.log(res);
        // 关闭对话框
        this.editDialogVisible = false;
        // 刷新数据列表
        this.getCategories();
        // 提示修改成功
        this.$message.success("更新商品信息成功!");
      });
    },

    // 3、点击删除按钮
    async editDelete(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除!");
      }
      let res = await this.axios.delete(`categories/${id}`);
      // console.log(res);
      if (res.meta.status != 200) {
        return this.$message.error("删除该商品失败！");
      }
      this.$message.success(res.meta.msg); //删除成功
      // 刷新数据列表
      this.getCategories();
    },
  },
  mounted() {
    this.getCategories(), this.getParentCateList();
  },
  components: {},
};
</script>

<style scoped lang="less">
div {
  .el-breadcrumb ::v-deep .el-breadcrumb__inner {
    color: white !important;
    font-weight: 400 !important;
  }

  .el-card {
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

    .treeTable {
      margin: 15px 0;
    }
  }

  .el-cascader {
    width: 100%;
  }
}
</style>
