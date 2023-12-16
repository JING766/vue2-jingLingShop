<template>
  <div>
    <!-- Breadcrumb面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row>
        <el-input
          placeholder="请输入内容"
          v-model="ordersInfo.query"
          class="input-with-select"
          clearable
          @clear="getOrders()"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getOrders()"
          ></el-button>
        </el-input>
      </el-row>

      <!-- 商品列表表格 -->
      <el-table :data="tableData" stripe style="width: 100%" :border="true">
        <el-table-column width="50" type="index"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="update_time" label="下单时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.update_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <template slot-scope="scope">
            <!-- 修改地址按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showBox(scope.row.order_id)"
            ></el-button>

            <!-- 物流进度按钮 -->
            <el-button
              type="success"
              icon="el-icon-location-outline"
              size="mini"
              @click="showProgressBox(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="ordersInfo.pagenum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="ordersInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 修改地址按钮 -->
      <el-dialog
        title="修改地址"
        :visible.sync="addressVisible"
        width="50%"
        @close="addressDialogClosed"
      >
        <el-form
          :model="addressForm"
          :rules="addressFormRules"
          ref="addressFormRef"
          label-width="100px"
        >
          <el-form-item label="省市区/县" prop="address1">
            <!-- 级联选择器 -->
            <el-cascader
              :options="cityOptions"
              v-model="addressForm.address1"
              :props="{ expandTrigger: 'hover' }"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addressVisible = false">取 消</el-button>
          <el-button type="primary" @click="editOrders">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 物流进度按钮 -->
      <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
        <!-- 时间线 -->
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in progressInfo"
            :key="index"
            :timestamp="activity.time"
          >
            {{ activity.context }}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
// 导入
import cityOptions from "./city_data2017_element.js";

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
      ordersInfo: {
        query: "",
        pagenum: 1,
        pagesize: 3,
      },
      // 总页数
      total: 0,

      // 3、修改地址按钮
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: "",
      },
      addressFormRules: {
        address1: [
          { required: true, message: "请选择省市区/县", trigger: "blur" },
        ],
        address2: [
          { required: true, message: "请填写详细地址", trigger: "blur" },
        ],
      },
      // 级练选择器
      cityOptions: cityOptions,

      // 4、物流进度按钮
      // 隐藏表单
      progressVisible: false,
      progressInfo: [
        {
          time: "2018-05-10 09:39:00",
          ftime: "2018-05-10 09:39:00",
          context: "已签收,感谢使用顺丰,期待再次为您服务",
          location: "",
        },
        {
          time: "2018-05-10 08:23:00",
          ftime: "2018-05-10 08:23:00",
          context:
            "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
          location: "",
        },
        {
          time: "2018-05-10 07:32:00",
          ftime: "2018-05-10 07:32:00",
          context: "快件到达 [北京海淀育新小区营业点]",
          location: "",
        },
        {
          time: "2018-05-10 02:03:00",
          ftime: "2018-05-10 02:03:00",
          context:
            "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
          location: "",
        },
        {
          time: "2018-05-09 23:05:00",
          ftime: "2018-05-09 23:05:00",
          context: "快件到达 [北京顺义集散中心]",
          location: "",
        },
        {
          time: "2018-05-09 21:21:00",
          ftime: "2018-05-09 21:21:00",
          context: "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
          location: "",
        },
        {
          time: "2018-05-09 13:07:00",
          ftime: "2018-05-09 13:07:00",
          context: "顺丰速运 已收取快件",
          location: "",
        },
        {
          time: "2018-05-09 12:25:03",
          ftime: "2018-05-09 12:25:03",
          context: "卖家发货",
          location: "",
        },
        {
          time: "2018-05-09 12:22:24",
          ftime: "2018-05-09 12:22:24",
          context: "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
          location: "",
        },
        {
          time: "2018-05-08 21:36:04",
          ftime: "2018-05-08 21:36:04",
          context: "商品已经下单",
          location: "",
        },
      ],
    };
  },
  methods: {
    // 1、获取列表数据 （渲染数据）
    async getOrders() {
      try {
        let res = await this.axios.get("orders", { params: this.ordersInfo });
        if (res.meta.status != 200) {
          // console.log('ffff');
          throw new Error(res.meta.msg);
        }
        // console.log(res.data.goods);
        this.tableData = res.data.goods;
        this.total = res.data.total;
      } catch (error) {
        // console.error(error);
      }
    },

    // 2、分页方法
    handleSizeChange(val) {
      this.ordersInfo.pagesize = val;
      this.getOrders();
    },
    handleCurrentChange(val) {
      this.ordersInfo.pagenum = val;
      this.getOrders();
    },

    // 3、修改地址按钮
    async showBox(order_id) {
      let res = await this.axios.get(`orders/${order_id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数信息失败!");
      }
      // console.log(res);
      this.addressVisible = true;
    },
    // 清空表单
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields();
    },
    // 点击确认按钮
    editOrders() {
      // 关闭表单
      this.addressVisible = false;
    },

    // 4、点击物流进度按钮
    showProgressBox() {
      this.progressVisible = true;
    },

    // 3、点击确定修改数据
    // async editOrders() {
    //   this.$refs.addressFormRef.validate(async (valid) => {
    //     // console.log(valid);
    //     if (!valid) return;
    //     let res = await this.axios.put("orders/" + this.order_id, {
    //       user_id: this.addressForm.user_id,
    //     });
    //     // console.log(res);
    //     if (res.meta.status !== 200) {
    //       return this.$message.error("修改参数失败!");
    //     }
    //     this.$message.success("修改参数成功!");
    //     // 刷新数据列表
    //     this.getParamsData();
    //     // 关闭修改表单的对话框
    //     this.editDialogVisible = false;
    //   });
    // },

    // 4、物流进度按钮
    // async showProgressBox() {
    //   let res = await this.$http.get("/kuaidi/1106975712662");
    //   console.log(res);
    //   if (res.meta.status !== 200) {
    //     return this.$message.error("获取物流进度失败!");
    //   }
    //   this.progressInfo = res.data;
    //   // 显示表单
    //   this.progressVisible = true;
    //   console.log(this.progressInfo);
    // },
  },
  mounted() {
    this.getOrders();
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

    .el-row {
      .el-input {
        width: 400px;
      }
    }

    .el-table {
      margin: 15px 0;
    }

    .el-cascader {
      width: 100%;
    }

    .el-timeline-item {
      margin-left: 40px;
    }
  }
}
</style>
