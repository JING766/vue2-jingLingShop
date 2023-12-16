<template>
    <div class="reporesBox">
        <!-- Breadcrumb面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!-- 2、为 ECharts 准备一个定义了宽高的 DOM -->
            <div id="main" style="width: 600px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
// 1、导入echarts
import * as echarts from 'echarts'
import _ from 'lodash'

export default {
    props: {

    },
    data() {
        return {
            // 需要合并的数据
            options: {
                title: {
                    text: '用户来源'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#E9EEF3'
                        }
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        boundaryGap: false
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ]
            }
        };
    },
    methods: {

    },
    components: {

    },
    async mounted() {
        // 3、基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        let res = await this.axios.get('reports/type/1')

        if (res.meta.status !== 200) {
            return this.$message.error('获取折线图数据失败!')
        }
        // console.log(res);

        // 4、指定图表的配置项和数据
        let result = _.merge(res.data, this.options)

        // 5、使用刚指定的配置项和数据显示图表。
        myChart.setOption(result);

    },
};
</script>

<style scoped lang="less">
.reporesBox {
    .el-breadcrumb ::v-deep .el-breadcrumb__inner {
        color: white !important;
        font-weight: 400 !important;
    }

    .el-card {
        box-sizing: border-box;
        background-color: white;
        margin: 15px auto;
        border-radius: 7px;
    }

}
</style>
