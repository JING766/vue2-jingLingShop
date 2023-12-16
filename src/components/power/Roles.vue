
<template>
  <div class="rolesBox">
    <!-- Breadcrumb面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <!-- 添加角色 -->
          <el-button type="primary" @click="showAddRolesDialog"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolelist" style="width: 100%" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row class="rows"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环 嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 通过for循环 嵌套渲染三级权限 -->
                    <el-tag
                      type="warning"
                      closable
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label=""></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <!-- 删除 -->
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="editDelete(scope.row.id)"
              >删除</el-button
            >
            <!-- 分配权限 -->
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 1、点击添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesDialogVisible"
      width="50%"
      @closed="addDialogClosed"
    >
      <el-form
        :model="addRolesForm"
        :rules="addRolesRules"
        ref="addRolesFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 2、修改（编辑）角色 -->
    <el-dialog
      title="修改角色"
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
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolesInfo">确 定</el-button>
      </span>
    </el-dialog>

    
    <!-- 3、分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defkeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      // 所有角色列表数据
      rolelist: [],

      // 1、添加角色的对话框
      addRolesDialogVisible: false,
      // 添加角色的表单数据对象
      addRolesForm: {
        roleName: "",
        roleDesc: "",
      },
      // 添加角色表单的验证规则对象
      addRolesRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "change" },
          {
            min: 2,
            max: 15,
            message: "长度在 2 到 15 个字符",
            trigger: "change",
          },
        ],
      },

      // 2、编辑修改角色的对话框
      // 控制修改角色对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的角色信息对象
      editForm: {
        // roleName: "",
        // roleDesc: "",
      },
      // 修改表单的验证规则对象
      editFormRules: {},

      // 3、分配权限
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightslist: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children",
      },
      // 默认选中的节点id值数组
      defkeys: [],
      // 当前即将分配权限的角色id
      roleId: "",

    };
  },
  methods: {
    // 获取列表数据 （渲染数据）
    async getRolesList() {
      let res = await this.axios.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败!");
      }

      this.rolelist = res.data;
      // console.log(this.rolelist);

      // this.array = res.data
    },

    // 1、点击编辑按钮修改角色
    async showEditDialog(id) {
      //   console.log(id);
      let res = await this.axios.get("roles/" + id);
      if (res.meta.status != 200) {
        return this.$message.error("查询角色信息失败！");
      }
      this.editForm = res.data;
      //   console.log(this.editForm);
      // 显示修改角色对话框
      this.editDialogVisible = true;
    },
    // 监听添加角色对话框的关闭事件
    editDialogClosed() {
      // 当添加信息对话框关闭时清空已填内容
      this.$refs.editFormRef.resetFields();
    },
    // 点击确定按钮 修改角色信息并验证
    editRolesInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) return;
        // 发起修改角色信息的数据请求
        let res = await this.axios.put("roles/" + this.editForm.roleId, {
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc,
        });

        if (res.meta.status !== 200) {
          return this.$message.error("更新角色信息失败!");
        }
        // console.log(res);
        // 关闭对话框
        this.editDialogVisible = false;
        // 刷新数据列表
        this.getRolesList();
        // 提示修改成功
        this.$message.success("更新角色信息成功!");
      });
    },

    // 2、点击按钮删除角色
    async editDelete(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
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
      let res = await this.axios.delete(`roles/${id}`);
      // console.log(res);
      if (res.meta.status != 200) {
        return this.$message.error("删除该角色失败！");
      }
      // console.log(res.meta.msg);
      this.$message.success("删除该角色成功！"); //删除成功
      // 刷新数据列表
      this.getRolesList();
    },

    // 3、点击添加角色
    showAddRolesDialog() {
      // 显示对话框
      this.addRolesDialogVisible = true;
    },
    addRoles() {
      this.$refs.addRolesFormRef.validate(async (valid) => {
        if (!valid) return;
        let res = await this.axios.post("roles", this.addRolesForm);
        // console.log(res);
        // console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("添加分类失败!");
        }
        this.$message.success("添加分类成功!");
        // 刷新数据列表
        this.getRolesList();
        // 隐藏对话框
        this.addRolesDialogVisible = false;
      });
    },
    // 当添加信息对话框关闭时清空已填内容
    addDialogClosed() {
      this.$refs.addRolesFormRef.resetFields();
    },


      //4、 根据id删除对应的权限
    async removeRightById(role, rightId) {
      // 弹框提示角色是否要删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("取消了删除!");
      }
      // console.log('确认了删除!');
      let res = await this.axios.delete(`roles/${role.id}/rights/${rightId}`);
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败!");
      }

      // 刷新列表
      // this.getRolesList()
      role.children = res.data;
    },

    // 5、点击展示分配权限对话框
    async showSetRightDialog(role) {
      this.roleId = role.id;
      // 获取所有权限的数据
      let res = await this.axios.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限失败!");
      }
      // 获取到的权限数据保存到data中
      this.rightslist = res.data;
      // console.log(this.rightslist);

      // 递归获取三级节点的id
      this.getLeafKeys(role, this.defkeys);

      // 显示对话框
      this.setRightDialogVisible = true;
    },

    // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defkeys 数组中
    getLeafKeys(node, arr) {
      // 如果当前node节点不包含children属性,则 是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }

      node.children.forEach((item) => this.getLeafKeys(item, arr));
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defkeys = [];
    },

    // // 点击确定按钮 为角色分配权限
    async allotRights() {
       const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      // console.log(keys)
      const idStr = keys.join(',')

      let res = await this.axios.post(`roles/${this.roleId}/rights`, {
        rids: idStr,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败!')
      }
      // console.log(res)
      this.$message.success('分配权限成功!')
      // 刷新数据列表
      this.getRolesList()
      // 隐藏对话框
      this.setRightDialogVisible = false
    },

  },

  mounted() {
    this.getRolesList(); //获取表格数据
  },

  components: {},
};
</script>

<style scoped lang="less">
.rolesBox {
  .el-breadcrumb ::v-deep .el-breadcrumb__inner {
    color: white !important;
    font-weight: 400 !important;
    font-size: 12px;
  }

  .el-card {
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

    .el-table {
      margin-top: 15px;

      .el-tag {
        margin: 7px;
      }

      .bdtop {
        border-top: 1px solid #eee;
      }

      .bdbottom {
        border-bottom: 1px solid #eee;
      }

      .vcenter {
        display: flex;
        align-items: center;
      }

      .rows {
        margin: 0 50px;
      }
      
    }
  }

}
</style>
