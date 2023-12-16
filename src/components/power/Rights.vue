<template>
    <div class="rightsBox">
        <!-- Breadcrumb面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 主体 -->
        <el-card class="box-card">
            <!-- 角色列表 -->
            <el-table :data="rightsForm" stripe style="width: 100%" :border="true">
                <el-table-column width="50" type="index"> </el-table-column>
                <el-table-column prop="authName" label="权限名称" v-model="rightsForm.authName">
                </el-table-column>
                <el-table-column prop="path" label="路径" v-model="rightsForm.path"></el-table-column>
                <el-table-column prop="level" label="权限等级" v-model="rightsForm.level">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
                        <el-tag type="success" v-if="scope.row.level === '1'">二级权限</el-tag>
                        <el-tag type="warning" v-if="scope.row.level === '2'">三级权限</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

    </div>
</template>

<script>
export default {
    props: {

    },
    data() {
        return {
            // tableData: [],
            rightsForm: [],
        };
    },
    methods: {
        // 获取数据
        async getRights() {
            let res = await this.axios.get('/rights/list')
            this.rightsForm = res.data;
            // console.log(res.data);
        },
    },
    components: {

    },

    mounted() {
        this.getRights()
    }
};
</script>

<style scoped lang="less">
.rightsBox {
    .el-breadcrumb ::v-deep .el-breadcrumb__inner {
        color: white !important;
        font-weight: 400 !important;
    }

    .box-card {
        margin-top: 15px;
    }
}
</style>
