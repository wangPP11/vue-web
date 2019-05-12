<template>
    <el-form :model="user" ref="loginForm" :rules="rules" class="login-container" label-position="left" label-width="0px" v-loading="loading">
        <h3 class="login_title">系统登录</h3>
        <el-form-item prop="phone">
            <el-input type="text" v-model="user.name" auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input type="password" v-model="user.password" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item prop="kaptcha">
            <el-input type="text" v-model="user.kaptcha" auto-complete="off" placeholder="验证码"></el-input>
        </el-form-item>
        <el-form-item style="width: 100%" class="login_remember">
            <el-image :src="kaptcha" @click="refreshCode" alt="加载失败" >
                <div slot="placeholder" class="image-slot">
                    <i class="el-icon-loading"></i>
                </div>
            </el-image>
            <el-link class="rele_code" type="primary" @click="refreshCode">刷新</el-link>
            <el-button class="login_button" type="primary" @click="submitClick">登录</el-button>
        </el-form-item>
    </el-form>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import {User} from "@/entity/User";
    import {Base64} from "@/utils/Base64";
    import {Md5} from 'ts-md5/dist/md5';
    @Component({})
    export default class Login extends Vue {
        @Prop() private msg!: string;
        public user:User = new User("","","");
        rules:object = {
            name: [{required: true, message: '请输入用户名', trigger: 'blur'}],
            password: [{required: true, message: '请输入密码', trigger: 'blur'}],
            kaptcha: [{required: true, message: '请输入验证码', trigger: 'blur'}],
        }
        loading:boolean = false;

        kaptcha: string = "http://localhost:10000/vueweb/captcha.jpg?t=" + new Date().getTime();

        refreshCode(): void {
            this.kaptcha = "http://localhost:10000/vueweb/captcha.jpg?t=" + new Date().getTime();
        }

        submitClick(): void {
            const _this = this;

            this.loading = true;
            // 密码需要加密
            localStorage.clear();

            //_this.user.setPassword(Md5.hashStr(_this.user.getPassword()).toString())
            _this.axios.a
            // 登录
            _this.axios.post('/login',, _this.user)
            .then(resp => {
                _this.loading = false;
                // 设置全局的用户信息
                localStorage.setItem("token", resp.data.session.id);
                localStorage.setItem("username", resp.data.user.name)
                _this.$router.replace({path: '/home'});
            })
        }
    }
</script>
<style scoped lang="less">
    .login-container {
        border-radius: 15px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 35px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
    }

    .login_title {
        margin: 0px auto 40px auto;
        text-align: center;
        color: #505458;
    }

    .login_remember {
        text-align: left;
    }
    .login_button {
        position: absolute;
        text-align: right;
        right: 0px;
    }
    .rele_code{
        position: absolute;
        right: 100px;
    }
</style>
