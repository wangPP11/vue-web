<template>
  <div class="backdrop" v-loading="loading">
    <div v-show="isList">
      <el-row>
        <el-col :span="10" :offset="1">
          <el-input placeholder="请输入角色名称" clearable v-model="queryObj.value" class="input-with-select">
            <el-button slot="append" type="primary" icon="el-icon-search" @click="loadList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button v-show="button.save" type="primary" @click="add" icon="el-icon-circle-plus-outline"
                     class="padding-button" content="新增角色"></el-button>
          <el-popover v-show="button.delete" placement="top" width="200" v-model="visible2" content="删除角色">
            <p>确定要删除这些角色吗？</p>
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
      <el-table :data="roles" style="width: 100%" height="590" border
                @sort-change="solrLoad"
                @selection-change="selectRow">
        <!--多选框-->
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column sortable="custom" prop="id" label="ID" ></el-table-column>
        <el-table-column sortable="custom" prop="name" label="名称" ></el-table-column>
        <el-table-column label="操作" fixed="right" width="180">
          <template slot-scope="scope">
            <el-tooltip v-show="button.update" class="item" effect="dark" content="修改角色" placement="top">
              <el-button size="mini" type="primary" @click="update(scope.$index, scope.row)"
                         icon="el-icon-edit" circle></el-button>
            </el-tooltip>
            <el-tooltip v-show="button.delete" class="item" effect="dark" content="删除角色" placement="top">
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
      <el-form ref="role" :model="role" :rules="rules" label-width="80px" label-position="right"
               class="demo-ruleForm" size="mini">
        <el-form-item label="父级角色">
          <el-col :span=10>
            <el-input v-model="role.parentName" readonly @focus="dialogFormVisible = true"></el-input>
            <el-dialog title="选择父级角色" width="30%"
                       :close-on-click-modal="false"
                       :close-on-press-escape="false"
                       :show-close="false"
                       :visible.sync="dialogFormVisible">

                <el-tree :data="allRoles"
                         @node-click="setParentId"
                         node-key="id"
                         ref="parentId"
                         :accordion=true
                         :highlight-current=true
                         :default-expanded-keys=[role.parentId]
                         :current-node-key=role.parentId
                         :props="{children:'childs', label:'name'}">
                </el-tree>

                <div slot="footer" class="dialog-footer">
                  <el-button @click="role.parentId=0;role.parentName='';dialogFormVisible = false;">取消
                  </el-button>
                  <el-button type="primary" @click="dialogFormVisible = false">确定</el-button>
                </div>

            </el-dialog>
          </el-col>
        </el-form-item>

        <el-form-item prop="name" label="角色名称">
          <el-col :span="10">
            <el-input v-model="role.name"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="角色菜单">
          <el-col :span=10>
              <el-tree
                    :data="menus"
                    @check="getMenuIds"
                    show-checkbox
                    ref="menuIds"
                    :accordion=true
                    node-key="id"
                    :props="{children: 'childs', label: 'name'}">
              </el-tree>
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-col :span="10">
            <el-button type="primary" @click="submitRole('role')">提交</el-button>
            <el-button @click="notSubmitRole('role')">取消</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import {Role} from "@/entity/Role";
  import {Menu} from "@/entity/Menu";
  import {Query} from "@/utils/Query";
  import {StringUtils} from  "@/utils/StringUtils"
  @Component({})
  export default class RoleManager extends Vue {

    rules: object = {
      name: [ {required: true, message: '请输入角色名称', trigger: 'blur'},
        {min:2, max:16, message:"限制2~16个字符", trigger: 'blur'}
      ]
    }

    loading: boolean = false;
    isList: boolean = true;
    visible2: boolean = false;
    dialogFormVisible: boolean = false;

    roles: Array<Role> = [];
    selectRoles: Array<Role> = [];
    allRoles: Array<Role> = [];
    menus: Array<Menu> = [];
    // 初始化菜单信息
    role: Role = new Role();
    button: object = {
      save: StringUtils.isPermisson('sys:role:save,sys:menu:perms'),
      update: StringUtils.isPermisson('sys:role:update,sys:menu:perms'),
      delete: StringUtils.isPermisson('sys:role:delete')
    }
    queryObj: Query = new Query();

    mounted():void{
      // 设置默认的搜索类型
      this.queryObj.type = "name";
      this.loadList();
      this.allMenu();
      this.allRole();
    }
    // 加载列表数据
    loadList():void {
      const _this = this;
      _this.isList = true;
      _this.loading = true; 
      _this.axios.get("/role/list",{params: _this.queryObj})
          .then(resp=> {
            _this.loading = false;
            _this.roles = resp.data.records;
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
      this.selectRoles = val;
    }
    // ——

    // 获取所有的角色
    getRoles():void{
      let _this = this;
    }

    // 新增
    add():void{
      this.isList = false;
      this.role = new Role();
    }
    // 修改
    update(index:number, row: Role):void{
      this.isList = false;
      this.role = row;
    }

    submitRole (role:string): void {
      let _this = this;
      let el: any = this.$refs[role];
      el.validate((valid: any) => {
        if (valid) {
          _this.loading = true;
          if (_this.role.id) {
            _this.axios.put("/role/update",_this.role)
                .then((resp: any) => {
                  _this.loading = false;
                  if (resp.code == 0){
                    _this.$message.success("修改成功了！");
                    _this.loadList();
                  }
                })
          }else{
            _this.axios.post("/role/save",_this.role)
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

    notSubmitRole (role:string): void{
      this.isList = true;
      this.role = new Role();
    }

    remove():void{
      let _this = this;
      _this.visible2 = false;
      if (_this.selectRoles.length == 0) {
        _this.$message.error("请选择需要删除的角色");
        return;
      }
      let arr = new Array<number>();
      _this.selectRoles.forEach((ele: Role)=>{
        arr.push(ele.id)
      })
      _this.axios.delete("/role/delete",{data:arr})
          .then((resp: any)=>{
            if (resp.code == 0){
              _this.$message.success("删除成功了！");
              _this.loadList();
            }
          })
    }

    closeRole(idnex:number, row: any):void{
      let _this = this;
      _this.$alert("确认删除这个菜单吗？", "友情提示", {
        confirmButtonText: "确认",
        callback: action => {
          _this.axios.delete("/role/delete", {data: [row.id]})
              .then((resp: any) => {
                if (resp.code == 0) {
                  _this.$message.success("删除成功了！");
                  if (_this.roles.length <= 1 && _this.queryObj.currentPage > 1) {
                    _this.queryObj.currentPage = _this.queryObj.currentPage - 1;
                  }
                  _this.loadList();
                }
              })
        }
      })
    }

    setParentId(data: Role,node: any, eml:any): void {
      this.role.parentId = data.id;
      this.role.parentName = data.name;
    }

    getMenuIds(data: any, eml:any){
      let ele:any = this.$refs["menuIds"];
      let checkedNodes:Array<Menu> = ele.getCheckedNodes();
      let menuIds = new Array<number>();
      checkedNodes.forEach((ele:Menu)=>{
        menuIds.push(ele.id);
        let isAdd: boolean = true;
        if(ele.parentId != 0){
          menuIds.forEach(menuId=>{
            if (menuId == ele.parentId) {
              isAdd = false;
            }
          })
        } else {
          isAdd = false;
        }
        if (isAdd){
          menuIds.push(ele.parentId)
        }
      })
      this.role.menuIds = menuIds;
    }

    // 全部菜单
    allMenu(): void {
      let _this = this;
      _this.axios.get("/menu/perms")
      .then((resp: any)=>{
        if (resp.code == 0) {
          _this.menus = resp.data;
        }
      })
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
