<template>
  <div class="goodsBox">
    <!-- Breadcrumb面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row>
        <el-input
          placeholder="请输入内容"
          v-model="goodsInfo.query"
          class="input-with-select"
          clearable
          @clear="getGoods()"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getGoods()"
          ></el-button>
        </el-input>

        <!-- 添加信息的会话框 -->
        <el-button type="primary" @click="goodsAdd">添加商品</el-button>
      </el-row>
      <router-view></router-view>
      <!-- 商品列表表格 -->
      <el-table :data="tableData" stripe style="width: 100%" :border="true">
        <el-table-column width="50" type="index"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）" width="95">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="70">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.goods_id)"
              >编辑</el-button
            >

            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="editDelete(scope.row.goods_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="goodsInfo.pagenum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="goodsInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 编辑按钮会话框 -->
    <el-dialog
      title="修改商品信息"
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
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格（元）" prop="goods_price">
          <el-input v-model="editForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_weight">
          <el-input v-model="editForm.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="add_time">
          <el-input v-model="editForm.add_time"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoodsInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      // 表格边框
      border: true,
      // 搜索框
      input: "",
      // 从后台请求的商品列表数据
      tableData: [],
      // 列表参数
      goodsInfo: {
        query: "",
        pagenum: 1,
        pagesize: 3,
      },
      // 总页数
      total: 0,

      // 1、 编辑修改商品信息的对话框
      // 控制修改商品信息对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的商品信息对象
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        add_time: [
          { required: true, message: "请输入商品时间", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 获取列表数据 （渲染数据）
    async getGoods() {
      try {
        let res = await this.axios.get("goods", { params: this.goodsInfo });
        if (res.meta.status != 200) {
          // console.log('ffff');
          throw new Error("获取商品信息失败!");
        }
        // console.log(res.data);
        this.tableData = res.data.goods;
        this.total = res.data.total;
      } catch (error) {
        // console.error(error);
      }
    },

    // 分页方法
    handleSizeChange(val) {
      this.goodsInfo.pagesize = val;
      this.getGoods();
    },
    handleCurrentChange(val) {
      this.goodsInfo.pagenum = val;
      this.getGoods();
    },

    // 点击添加商品
    goodsAdd() {
      // console.log('fffff');
      this.$router.push({ name: "goodsAdd" }).catch((error) => "");
    },

    // 1、点击编辑按钮修改商品信息
    async showEditDialog(id) {
      //   console.log(id);
      let res = await this.axios.get("goods/" + id);
      if (res.meta.status != 200) {
        return this.$message.error("查询商品信息失败！");
      }
      //   console.log(res);
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
    editGoodsInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) return;
        // 发起修改用户信息的数据请求
        let res = await this.axios.put(
          "/goods/" + this.editForm.goods_id,
          this.editForm
        );
        if (res.meta.status !== 200) {
          return this.$message.error("更新用户信息失败!");
        }
        // console.log(res);
        // 关闭对话框
        this.editDialogVisible = false;
        // 刷新数据列表
        this.getGoods();
        // 提示修改成功
        this.$message.success("更新用户信息成功!");
      });
    },

    // 2、删除按钮
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
      let res = await this.axios.delete(`goods/${id}`);
      // console.log(res);
      if (res.meta.status != 200) {
        return this.$message.error("删除该商品失败！");
      }
      this.$message.success(res.meta.msg); //删除成功
      // 刷新数据列表
      this.getGoods();
    },
  },
  mounted() {
    this.getGoods();
  },

  components: {},
};
</script>

<style scoped lang="less">
.goodsBox {
  .el-breadcrumb ::v-deep .el-breadcrumb__inner {
    color: white !important;
    font-weight: 400 !important;
  }

  .el-card {
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

    .el-row {
      .el-input {
        width: 400px;
      }

      > .el-button {
        margin-left: 20px;
      }
    }

    .el-table {
      margin: 15px 0;
    }
  }
}
</style>
