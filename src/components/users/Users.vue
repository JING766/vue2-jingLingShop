<template>
  <div>
    <!-- 顶部导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 添加信息的会话框 -->
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户列表数据 -->
      <el-table :data="userlist" stripe border style="width: 100%">
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <!-- 编辑修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            >
            </el-button>

            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            >
            </el-button>
            <!-- 分配角色按钮悬浮提示信息 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <!-- 分配角色按钮 -->
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              >
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 1、添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @closed="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名称" prop="username">
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

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 2、编辑修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 编辑表单 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
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
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 3、分配角色权限的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <p>
          分配新角色:
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    // 表单验证
    // 验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      //验证邮箱的正则表达式
      const regEmail =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (regEmail.test(value)) {
        // 正确的邮箱
        return callback();
      }
      callback(new Error("请输入正确的邮箱！"));
    };
    // 验证手机号的规则
    var checkMobile = (rule, value, callback) => {
      const regMobile =
        /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      callback(new Error("请输入正确的手机号！"));
    };

    return {
      // 搜索框
      input: "",
      // 获取用户列表的参数对象
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2,
      },
      //用户列表中所有的数据
      userlist: [],
      // 总页数
      total: 0,

      // 2、添加用户
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "用户名长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入正确的邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入正确的手机号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },

      // 3、编辑修改按钮
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {
        // username: "",
        // password: "",
        // email: "",
        // mobile: "",
      },
      // 修改表单的验证规则对象
      editFormRules: {
        email: [
          { required: true, message: "请输入正确的邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入正确的手机号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },

      // 5、分配角色权限按钮
      //控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 已选中的角色id值
      selectedRoleId: "",
    };
  },
  methods: {
    // 获取列表中的所有数据
    async getUserList() {
      let res = await this.axios.get("users", {
        params: this.queryInfo,
      });
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败!");
      }
      // 接收列表中的所有数据
      this.userlist = res.data.users;
      // console.log(this.userlist);

      // 接收分页中的数据
      this.total = res.data.total;
    },

    // 分页方法
    // 监听pagesize改变的事件
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getUserList();
    },
    // 监听pagenum改变的事件
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getUserList();
    },

    // 1、状态按钮
    async userStateChanged(userinfo) {
      let res = await this.axios.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("设置状态失败!");
      }
      this.$message.success(res.meta.msg);
      // console.log(res);
    },

    // 2、添加用户
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      // 当添加信息对话框关闭时清空已填内容
      this.$refs.addFormRef.resetFields();
    },
    //点击确定按钮添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        //可以发起添加用户的网络请求
        let res = await this.axios.post("users", this.addForm);
        if (res.meta.status != 201) {
          return this.$message.error("添加用户信息失败！");
        }
        this.$message.success("成功添加用户信息！");
        // 隐藏添加用户的对话框
        this.addDialogVisible = false;
        // 刷新用户列表
        this.getUserList();
      });
    },

    // 3、编辑修改用户按钮
    // 点击修改按钮 展示编辑按钮的对话框
    async showEditDialog(id) {
      // console.log(id);
      let res = await this.axios.get("users/" + id);
      if (res.meta.status != 200) {
        return this.$message.error("查询用户信息失败！");
      }
      this.editForm = res.data;
      // 显示修改用户对话框
      this.editDialogVisible = true;
    },
    // 监听添加用户对话框的关闭事件
    editDialogClosed() {
      // 当添加信息对话框关闭时清空已填内容
      this.$refs.editFormRef.resetFields();
    },
    // 点击确定按钮 修改用户信息并验证
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) return;
        // 发起修改用户信息的数据请求
        let res = await this.axios.put("users/" + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile,
        });
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("更新用户信息失败!");
        }
        // 关闭对话框
        this.editDialogVisible = false;
        // 刷新数据列表
        this.getUserList();
        // 提示修改成功
        this.$message.success("更新用户信息成功!");
      });
    },

    // 4、点击删除按钮 根据id删除对应的用户信息
    async removeUserById(id) {
      // 弹框询问用户是否删除对应的数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((error) => error);
      // 如果用户确认删除，则返回值为字符串confirm
      // 如果用户取消了删除，则返回值为字符串cancel
      // console.log(confirmResult);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除!");
      }
      // console.log("确认了删除");
      let res = await this.axios.delete(`users/${id}`);
      if (res.meta.status != 200) {
        return this.$message.error("删除该用户失败！");
      }
      // console.log(res);
      this.$message.success("删除该用户成功！"); //删除成功
      // 刷新数据列表
      this.getUserList();
    },

    // 5、分配角色权限
    // 展示分配角色的对话框
    async setRole(userInfo) {
      this.userInfo = userInfo;

      // 获取所有的角色列表
      let res = await this.axios.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败!");
      }
      // console.log(res);
      this.rolesList = res.data;
      // 显示分配角色的对话框
      this.setRoleDialogVisible = true;
    },

    // 点击按钮 分配角色
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error("请选择要分配的角色!");
      }
      let res = await this.axios.put(`users/${this.userInfo.id}/role`, {
        rid: this.selectedRoleId,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("更新角色失败!");
      }
      // console.log(res);
      this.$message.success("更新角色成功!");
      // 刷新数据列表
      this.getUserList();
      // 隐藏分配角色的对话框
      this.setRoleDialogVisible = false;
    },

    // 重置对话框 监听分配角色对话框的关闭事件
    setRoleDialogClosed() {
      this.selectedRoleId = "";
      this.userInfo = {};
    },
  },
  mounted() {
    this.getUserList();
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

    .el-table {
      margin: 15px 0;
    }
  }
  p {
    margin: 15px 0;
  }
}
</style>
