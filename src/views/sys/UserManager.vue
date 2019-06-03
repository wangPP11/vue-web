<template>
  <div class="backdrop" v-loading="loading">
    <div v-show="isList">
      <el-row>
        <el-col :span="10" :offset="1">
          <el-input placeholder="请输入用户昵称" clearable v-model="queryObj.value" class="input-with-select">
            <el-button slot="append" type="primary" icon="el-icon-search" @click="loadList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button v-show="button.save" type="primary" @click="add" icon="el-icon-circle-plus-outline"
                     class="padding-button" content="新增用户"></el-button>
          <el-popover v-show="button.delete" placement="top" width="200" v-model="visible2" content="删除用户">
            <p>确定要删除这些用户吗？</p>
            <br/>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="primary" class="padding-button" @click="visible2 = false">取消
              </el-button>
              <el-button size="mini" type="danger" class="padding-button" @click="remove">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" @click="visible2 = true" icon="el-icon-delete"
                       class="padding-button"></el-button>
          </el-popover>
        </el-col>
      </el-row>
      <div class="margin-bottom"></div>
      <el-table :data="users" style="width: 100%" height="590" border
                @sort-change="solrLoad"
                @selection-change="selectRow">
        <!--多选框-->
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column sortable="custom" prop="id" label="ID" ></el-table-column>
        <el-table-column sortable="custom" prop="name" label="名称" ></el-table-column>
        <el-table-column label="操作" fixed="right" width="180">
          <template slot-scope="scope">
            <el-tooltip v-show="button.update" class="item" effect="dark" content="修改用户" placement="top">
              <el-button size="mini" type="primary" @click="update(scope.$index, scope.row)"
                         icon="el-icon-edit" circle></el-button>
            </el-tooltip>
            <el-tooltip v-show="button.delete" class="item" effect="dark" content="删除用户" placement="top">
              <el-button size="mini" type="danger" @click="closeRole(scope.$index, scope.row)"
                         icon="el-icon-delete" circle></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="pageSizeChange"
          @current-change="currentPageChange"
          :current-page="queryObj.currentPage"
          :page-sizes="[5, 10, 20, 30, 40]"
          :page-size="queryObj.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="queryObj.total">
      </el-pagination>
    </div>

    <div v-show="!isList">
      <el-form ref="user" :model="user" :rules="rules" label-width="80px" label-position="right"
               class="demo-ruleForm" size="mini">

        <el-form-item prop="name" label="用户名称">
          <el-col :span="10">
            <el-input v-model="user.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item prop="name" label="用户密码">
          <el-col :span="10">
            <el-input v-model="user.password"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="用户角色">
          <el-col :span=10>
            <el-tree ref="roleIds" node-key="id" @check="setRoleIds"
              :data="allRoles"
              :show-checkbox=true
              :accordion=true
              :props="{children: 'childs', label: 'name'}">
          </el-tree>
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-col :span="10">
            <el-button type="primary" @click="submitUser('user')">提交</el-button>
            <el-button @click="notSubmitUser('user')">取消</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import {Role} from "@/entity/Role";
  import {User} from "@/entity/User";
  import {Query} from "@/utils/Query";
  import {StringUtils} from  "@/utils/StringUtils"
  @Component({})
  export default class UserManager extends Vue {

    rules: object = {
      name: [ {required: true, message: '请输入用户名称', trigger: 'blur'},
        {min:2, max:16, message:"限制2~16个字符", trigger: 'blur'}
      ],
      password:[{required: true, message: '请输入用户密码', trigger: 'blur'},
        {min:2, max:16, message:"限制2~16个字符", trigger: 'blur'}]
    }

    loading: boolean = false;
    isList: boolean = true;
    visible2: boolean = false;
    dialogFormVisible: boolean = false;

    users: Array<User> = [];
    selectUsers: Array<User> = [];
    allRoles: Array<Role> = [];
    // 初始化菜单信息
    user: User = new User();
    button: object = {
      save: StringUtils.isPermisson('sys:user:save,sys:role:select'),
      update: StringUtils.isPermisson('sys:user:update'),
      delete: StringUtils.isPermisson('sys:user:delete')
    }
    queryObj: Query = new Query();

    mounted():void{
      // 设置默认的搜索类型
      this.queryObj.type = "name";
      this.loadList();
      this.allRole();
    }
    // 加载列表数据
    loadList():void {
      const _this = this;
      _this.isList = true;
      _this.loading = true;
      _this.axios.get("/user/list",{params: _this.queryObj})
          .then(resp=> {
            _this.loading = false;
            _this.users = resp.data.records;
            _this.queryObj.total = resp.data.total;
          })
    }

    // 切换搜索条件
    solrLoad(val: any):void{
      this.queryObj.isAsc = val.order == "ascending";
      this.queryObj.orderFields = val.prop;
      this.loadList();
    }
    // 切换每页数量
    pageSizeChange(val: any):void{
      this.queryObj.pageSize = val;
      this.loadList();
    }
    // 切换页面数
    currentPageChange(val:any):void{
      this.queryObj.currentPage = val;
      this.loadList();
    }
    // 选中的值
    selectRow(val:any):void{
      this.selectUsers = val;
    }

    // 新增
    add():void{
      this.isList = false;
      this.user = new User();
      let ele:any = this.$refs["roleIds"];
      ele.setCheckedKeys(this.user.roleIds);
    }
    // 修改
    update(index:number, row: Role):void{
      this.loading = true;
      this.isList = false;
      this.user = new User();
      this.user.id = row.id;
      this.user.name = row.name;

      this.getRolesIdsByUserId(row.id).then(resp=>{
        this.user.roleIds = resp;
        this.loading = false;
      })

    }

    submitUser (user:string): void {
      let _this = this;
      let el: any = this.$refs[user];
      el.validate((valid: any) => {
        if (valid) {
          _this.loading = true;
          if (_this.user.id) {
            _this.axios.put("/user/update",_this.user)
                .then((resp: any) => {
                  _this.loading = false;
                  if (resp.code == 0){
                    _this.$message.success("修改成功了！");
                    _this.loadList();
                  }
                })
          }else{
            _this.axios.post("/user/save",_this.user)
                .then((resp: any)=>{
                  _this.loading = false;
                  if(resp.code == 0) {
                    _this.$message.success("添加成功了！")
                    _this.loadList();
                  };
                })
          }
        }else{
          this.$message.error("错误的提交");
          return;
        }
      })
    }

    notSubmitUser (user:string): void{
      this.isList = true;
      this.user = new User();
    }

    remove():void{
      let _this = this;
      _this.visible2 = false;
      if (_this.selectUsers.length == 0) {
        _this.$message.error("请选择需要删除的用户");
        return;
      }
      let arr = new Array<number>();
      _this.selectUsers.forEach((ele: User)=>{
        arr.push(ele.id)
      })
      _this.loading = true;
      _this.axios.delete("/user/delete",{data:arr})
          .then((resp: any)=>{
            if (resp.code == 0){
              _this.$message.success("删除成功了！");
              _this.loadList();
            }
          })
    }

    closeRole(idnex:number, row: any):void{
      let _this = this;
      _this.$alert("确认删除这个用户吗？", "友情提示", {
        confirmButtonText: "确认",
        callback: action => {
          _this.loading = true;
          _this.axios.delete("/user/delete", {data: [row.id]})
              .then((resp: any) => {
                if (resp.code == 0) {
                  _this.loading = false;
                  _this.$message.success("删除成功了！");
                  if (_this.users.length <= 1 && _this.queryObj.currentPage > 1) {
                    _this.queryObj.currentPage = _this.queryObj.currentPage - 1;
                  }
                  _this.loadList();
                }
              })
        }
      })
    }

    setRoleIds(data: any, eml:any){
      let roleIds = new Array<number>();
      let ele:any = this.$refs["roleIds"];
      roleIds = ele.getCheckedKeys(true);
      this.user.roleIds = roleIds;
      console.log(this.user)
    }

    allRole ():void {
      let _this = this;
      _this.axios.get("/role/select")
          .then((resp: any)=>{
            if (resp.code == 0) {
              _this.allRoles = resp.data;
            }
          })
    }

    getRolesIdsByUserId(userId:number):Promise<any> {
      let _this = this;
      let menuIds = new Array();
      return new Promise(function (resolve, reject) {
        _this.axios.get('/role/user/'+userId)
            .then((resp:any)=>{
              if (resp.code == 0) {
                resp.data.forEach((ele:any)=>{
                  menuIds.push(ele.id);
                })
              }
              resolve(menuIds);
            })
      });
    }

  }
</script>

<style scoped>
  .el-col{
    margin-bottom: 10px;
    margin-top: 10px;
  }
  .demo-ruleForm{
    padding-top: 20px;
    padding-left: 20px;
  }
</style>

