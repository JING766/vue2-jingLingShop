<template>
  <div class="goodsAddBox">
    <!-- Breadcrumb面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 提示信息区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 步骤条区域 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏(标签页)区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="tabPosition"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabclicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                expand-trigger="hover"
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
                <el-checkbox label="复选框 B"></el-checkbox>
                <el-checkbox label="复选框 C"></el-checkbox>
                <el-checkbox label="禁用" disabled></el-checkbox>
                <el-checkbox label="选中且禁用" disabled></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 图片要上传到的后台API地址 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="btnAdd" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
// 导入lodash
import _ from "lodash";

export default {
  props: {},
  data() {
    return {
      activeIndex: "0", //步骤条默认显示

      tabPosition: "left", // tab栏(标签页) 字体左对齐
      // 添加商品的表单数据对象
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],

        // 4、图片的数组
        pics: [],

        // 5、商品详情描述
        goods_introduce: "",
        attrs: [],
      },
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      // 1、商品分类列表
      catelist: [],
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },

      // 2、动态参数列表数据
      manyTableData: [],

      // 3、静态属性列表数据
      onlyTableData: [],

      // 4、上传图片的URL地址
      uploadURL: "http://www.chenfuguo.cn:8899/api/private/v1/upload",
      // 图片上传组件的headers请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      // 图片预览
      previewPath: "",
      // 图片预览对话框的显示与隐藏
      previewVisible: false,
    };
  },

  methods: {
    async getCateList() {
      let res = await this.axios.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类数据失败!");
      }
      this.catelist = res.data;
      // console.log(this.cateliat);
    },
    // 级联选择器选中变化，会触发这个函数
    handleChange() {
      // console.log(this.addForm.goods_cat);
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },

    // 页面切换
    beforeTabLeave(activeName, oldActiveName) {
      // console.log("即将离开的标签页名字是:" + oldActiveName);
      // console.log("即将进入的标签页名字是:" + activeName);
      // return false

      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请选择商品分类!");
        return false;
      }
    },

    // tab被选中时触发 动态参数
    async tabclicked() {
      // console.log(this.activeIndex);
      // 证明访问的是动态参数面板
      if (this.activeIndex === "1") {
        // console.log("动态参数面板");
        let res = await this.axios.get(`categories/${this.cateId}/attributes`, {
          params: { sel: "many" },
        });

        if (res.meta.status !== 200) {
          return this.$message.error("获取动态参数列表失败!");
        }
        // console.log(res.data);
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyTableData = res.data;
      } else if (this.activeIndex == "2") {
        let res = await this.axios.get(`categories/${this.cateId}/attributes`, {
          params: { sel: "only" },
        });
        if (res.meta.status !== 200) {
          return this.$message.error("获取静态属性失败!");
        }
        // console.log(res.data);
        this.onlyTableData = res.data;
      }
    },

    // 4、图片上传
    // 处理图片预览效果
    handlePreview(file) {
      // console.log(file);
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
    },
    // 处理移出图片的操作
    handleRemove(file) {
      // console.log(file);
      // 1.获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path;
      // 2.从 pics 数组中，找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex((x) => x.pic === filePath);
      // 3.调用数组的 splice 方法，把图片信息对象，从pics 数组中移除
      this.addForm.pics.splice(i, 1);
      // console.log(this.addForm);
    },
    // 监听图片上传成功的事件
    handleSuccess(response) {
      // console.log(response);
      // 1.拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path };
      // 2.将图片信息对象，push 到 pics数组中
      this.addForm.pics.push(picInfo);
      // console.log(this.addForm);
    },
    // 5、点击添加商品按钮
    add() {
      // console.log(this.addForm);
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请填写必要的表单项!");
        }
        // 执行添加的业务逻辑
        // lodash  cloneDeep(obj) 深拷贝
        const form = _.cloneDeep(this.addForm);
        form.goods_cat = form.goods_cat.join(",");
        // 处理动态参数
        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          };
          this.addForm.attrs.push(newInfo);
        });
        // 处理静态属性
        this.onlyTableData.forEach((item) => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals };
          this.addForm.attrs.push(newInfo);
        });
        form.attrs = this.addForm.attrs;
        // console.log(form);

        // 发起请求添加商品
        //商品的名称，必须是唯一的
        let res = await this.axios.post("goods", form);

        if (res.meta.status !== 201) {
          return this.$message.error("添加商品失败!");
        }
        // console.log(res.meta);
        this.$message.success("添加商品成功!");
        this.$router.push({ name: "goods" }).catch((error) => "");
      });
    },
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
  mounted() {
    this.getCateList();
  },
  components: {},
};
</script>

<style scoped lang="less">
.goodsAddBox {
  .el-breadcrumb ::v-deep .el-breadcrumb__inner {
    color: white !important;
    font-weight: 400 !important;
  }

  .el-card {
    margin: 15px;
  }

  .el-steps {
    margin: 15px 0;
  }

  .el-step_title {
    font-size: 13px;
  }

  .el-checkbox {
    margin: 0 10px 0 0 !important;
  }

  // 4、图片预览
  .previewImg {
    width: 100%;
  }
  // 5、富文本最小高度
  // 富文本编辑器高度
   .ql-editor {
      height: 300px;
    }
  // 5、添加商品按钮
  .btnAdd {
    margin-top: 15px;
  }
}
</style>
