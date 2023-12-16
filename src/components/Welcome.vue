<template>
    <div class="continer">
        <!-- <h3>Welcome</h3> -->
        <!-- <img class="logo" src="@/assets/jingling.png" alt="" /> -->
        <img class="logo" src="@/assets/jinglingBg2.png" alt="" />
        <h3>欢迎来到<span>精灵购物</span>平台管理系统</h3>

        <p class="copyright">老陈前端课堂版权所有©2022</p>
        <p class="copyright">@ChenFuguo互联网技术传播者</p>
    </div>
</template>
  
<script>
export default {
    props: {},
    data() {
        return {}
    },
    methods: {},
    components: {}
}
</script>
  
<style scoped lang="less">
.continer {
    text-align: center;
    font-size: 40px;

    h3 {
        margin-top: 300px;
        letter-spacing: 10px;

        // font-family: "娃娃体-简";
        span {
            color: #06f8fc;
            font-size: 70px;
            font-family: '娃娃体-简';
        }
    }

    .logo {
        width: 500px;
        position: absolute;
        left: 50%;
        top: 10%;
        transform: translateX(-43%);
    }

    .copyright {
        font-size: 12px;
        color: rgb(228, 225, 225);
        position: absolute;
        bottom: 80px;
        left: 50%;
    }

    .copyright:nth-of-type(2) {
        bottom: 60px;
    }
}
</style>
  