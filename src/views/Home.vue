<template>
  <el-container class="home_container">
    <el-header>
      <div class="home_title">管理平台</div>
      <div class="home_userinfoContainer">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link home_userinfo">
            {{currentUserName}}<i class="el-icon-arrow-down el-icon--right home_userinfo"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="sysMsg">系统消息</el-dropdown-item>
            <el-dropdown-item command="MyArticle">我的文章</el-dropdown-item>
            <el-dropdown-item command="MyHome">个人主页</el-dropdown-item>
            <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu default-active="0" class="el-menu-vertical-demo" style="background-color: #ECECEC" router>
          <template v-for="(item,index) in this.menus" v-if="!item.hidden">
            <el-submenu :index="index+''" :key="index">
              <template slot="title">
                <span :class="item.icon"></span>
                <span>{{item.name}}</span>
              </template>
              <el-menu-item v-for="child in item.childs" :index="child.url" :key="child.url">
                <span :class="child.icon"></span>
                <span>{{child.name}}</span>
              </el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-text="this.$router.currentRoute.name"></el-breadcrumb-item>
          </el-breadcrumb>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
//import {StringUtils} from "@/utils/StringUtils";
//import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

@Component({})
export default class Home extends Vue {
  currentUserName:string = "";
  menus: Array<object> = [];
  mounted(){
    const username = localStorage.getItem("username");
    if (username != null) {
      this.currentUserName = username.toString();
    }
    // 获取菜单
    const _this = this;
    _this.axios.get("/menu/userMenu")
    .then((rest:any) =>{
      if (rest.code == 0) {
        _this.menus = rest.data.menus;
        localStorage.setItem("permissionList", JSON.stringify(rest.data.permissions))
      }
    })
  }
  handleCommand(command:string):void{
    var _this = this;
    if (command == 'logout') {
      this.$confirm('注销登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        _this.currentUserName = '游客';
        _this.$router.replace({path: '/'});
      }, function () {
        //取消
      })
    }else{
      _this.$alert(command);
    }
  }
}
</script>
<style scoped lang="less">
  .home_container {
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
  }

  .el-header {
    background-color: #20a0ff;
    color: #333;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .el-aside {
    background-color: #ECECEC;
  }

  .el-main {
    background-color: #fff;
    color: #000;
    text-align: center;
  }

  .home_title {
    color: #fff;
    font-size: 22px;
    display: inline;
  }

  .home_userinfo {
    color: #fff;
    cursor: pointer;
  }

  .home_userinfoContainer {
    display: inline;
    margin-right: 20px;
  }
</style>
