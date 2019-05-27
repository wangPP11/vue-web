<template>
  <div class="backdrop" v-loading="loading" element-loading-text="数据加载中">
    <div v-show="isList">
      <el-row>
        <el-col :span="10" :offset="1">
          <el-input placeholder="请输入内容" clearable v-model="queryObj.value" class="input-with-select">
            <el-select v-model="queryObj.type" slot="prepend" placeholder="请选择">
              <el-option label="名称" value="name"></el-option>
              <el-option label="路径" value="path"></el-option>
            </el-select>
            <el-button slot="append" type="primary" icon="el-icon-search" @click="loadList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button v-show="button.save" type="primary" @click="add" icon="el-icon-circle-plus-outline"
                     class="padding-button"></el-button>
          <el-popover v-show="button.delete" placement="top" width="200" v-model="visible2">
            <p>确定要删除这些菜单吗？</p>
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
      <div class="margin-bottom-10"></div>
      <el-table :data="menuses" style="width: 100%" :height="tableHeight" border
                @sort-change="solrLoadMenusess"
                @selection-change="electRow">
        <!--多选框-->
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column sortable="custom" prop="id" label="ID" width="70"></el-table-column>
        <el-table-column sortable="custom" prop="name" label="名称" width="100" ></el-table-column>
        <el-table-column sortable="custom" prop="url" label="链接" width="120"></el-table-column>
        <el-table-column sortable="custom" prop="type" label="类型" width="80">
          <template slot-scope="scope">
            <el-tag type="success" size="medium" v-if="scope.row.type == 1">菜单</el-tag>
            <el-tag type="info" size="medium" v-if="scope.row.type == 2">按钮</el-tag>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" prop="permission" label="权限"></el-table-column>
        <el-table-column label="操作" fixed="right" width="180">
          <template slot-scope="scope">
            <el-tooltip v-show="button.update" class="item" effect="dark" content="修改菜单" placement="top">
              <el-button size="mini" type="primary" @click="update(scope.$index, scope.row)"
                         icon="el-icon-edit" circle></el-button>
            </el-tooltip>
            <el-tooltip v-show="button.delete" class="item" effect="dark" content="删除菜单" placement="top">
              <el-button size="mini" type="danger" @click="closeMenu(scope.$index, scope.row)"
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
      <el-form ref="menu" :model="menu" :rules="rules" label-width="80px" label-position="right"
               class="demo-ruleForm" size="mini">
        <el-form-item prop="name" label="菜单名称">
          <el-col :span="10">
            <el-input v-model="menu.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item prop="type" label="类型">
          <el-col :span="3">
            <el-select v-model="menu.type" placeholder="请选择类型">
<!--              <el-option label="目录" value=0></el-option>-->
<!--              <el-option label="菜单" value=1></el-option>-->
<!--              <el-option label="按钮" value=2></el-option>-->
              <el-option
                  v-for="item in menuTypes"
                  :key="item.value"
                  :label="item.name"
              :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item prop="url" label="菜单路由" v-if="menu.type == 1">
          <el-col :span="10">
            <el-input v-model="menu.url"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="父级菜单">
          <el-col :span="10">
            <el-input v-model="menu.parentName" readonly @focus="dialogFormVisible = true"></el-input>
            <el-dialog title="选择父级菜单" width="30%"
                       :close-on-click-modal="false"
                       :close-on-press-escape="false"
                       :show-close="false"
                       :visible.sync="dialogFormVisible">
              <el-tree
                  :data="this.buildMenus()"
                  @node-click="setParentId"
                  node-key="id"
                  :accordion=true
                  :highlight-current=true
                  :default-expanded-keys=[menu.parentId]
                  :current-node-key=menu.parentId
                  :props="{children: 'childs', label: 'name'}">
              </el-tree>
              <div slot="footer" class="dialog-footer">
                <el-button @click="menu.parentId=0;menu.parentName='';dialogFormVisible = false;">取消
                </el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确定</el-button>
              </div>
            </el-dialog>
          </el-col>
        </el-form-item>
        <el-form-item prop="permission" label="菜单权限">
          <el-col :span="10">
            <el-input v-model="menu.permission"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="图标">
          <el-col :span="10">
            <el-input v-model="menu.icon"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="10">
            <el-button type="primary" @click="submitMenu('menu')">提交</el-button>
            <el-button @click="notSubmitMenu('menu')">取消</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import {Menu} from "@/entity/Menu";
  import {Query} from "@/utils/Query";
  import {StringUtils} from  "@/utils/StringUtils"
  @Component({})
  export default class MenuManager extends Vue {
    menuTypes: Array<any> = [{"value":0, "name":"目录"},{"value":1, "name":"菜单"},{"value":2, "name":"按钮"}]
    rules: object = {
        name: [ {required: true, message: '请输入菜单名称', trigger: 'blur'},
            {min:2, max:5, message:"限制2~5个字符", trigger: 'blur'}
        ],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        permission: [{ validator: (rule: any, value: any, callback: any)=> {
            let _this:any = this.$refs["menu"];
            if(_this.model.type == "2"){
              if (value === "") {
                callback(new Error("请输入权限"));
              }else {
                callback();
              }
            }else {
              callback();
            }
          }, trigger: 'change' }],
        url: [{ required: true, message: '请输入菜单路由', trigger: 'blur' }]
    }
    tableHeight:string = "375px";
    loading: boolean = false;
    isList: boolean = true;
    visible2: boolean = false;
    dialogFormVisible: boolean = false;
    menuses: Array<Menu> = [];
    electMenus: Array<Menu> = [];
    allMenus: Array<Menu> = [];
    // 初始化菜单信息
    menu: Menu = new Menu();
    button: object = {
      save: StringUtils.isPermisson('sys:menu:save,sys:menu:select'),
      update: StringUtils.isPermisson('sys:menu:update,sys:menu:select'),
      delete: StringUtils.isPermisson('sys:menu:delete')
    }
    queryObj: Query = new Query();

    mounted():void{
      this.loadList();
      this.tableHeight = window.innerHeight * 0.7 + "px";
      this.allMenu().then(resp=>{
        console.log("成功获取菜单")
      });
    }
    // 加载列表数据
    loadList():void {
      const _this = this;
      this.isList = true;
      _this.loading = true;
      _this.axios.get("/menu/list",{params: _this.queryObj})
              .then(resp=> {
                _this.loading = false;
                _this.menuses = resp.data.records;
                _this.queryObj.total = resp.data.total;
              })
    }

    // 切换搜索条件
    solrLoadMenusess(val: any):void{
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
    electRow(val:any):void{
      this.electMenus = val;
    }
    // ——

    // 新增菜单
    add():void{
      this.isList = false;
      this.menu = new Menu();
    }
    // 修改菜单
    update(index:number, row: Menu):void{
      this.isList = false;
      this.menu = row;
      this.setMenuParentName();
    }

    // 设置当前菜单的父级菜单名字
    setMenuParentName():void{
      let parentName: string = "";
      let id = this.menu.parentId;
      this.allMenus.forEach(ele => {
        if (ele.id == id) {
          parentName = ele.parentName;
        }else if (ele.childs != null) {
          ele.childs.forEach(child=>{
            if (child.id == id) {
              parentName = child.parentName;
            }
          })
        }
      })
      this.menu.parentName = parentName;
    }

    // 批量删除
    remove():void{
      let _this = this;
      _this.visible2 = false;
      if (this.electMenus.length == 0) {
        _this.$message.error("请选择需要删除的菜单");
        return;
      }
      let arr = new Array<number>();
      _this.axios.delete("/menu/delete",{data:arr})
              .then(resp=>{
                localStorage.removeItem("allMenus");
                _this.$message.success("删除成功了！");
                if(_this.electMenus.length >= _this.menuses.length && _this.queryObj.currentPage > 1){
                  _this.queryObj.currentPage = _this.queryObj.currentPage - 1;
                }
                _this.loadList();
              })
    }
    // 删除单个
    closeMenu(idnex:number, row: any):void{
      let _this = this;
      _this.$alert("确认删除这个菜单吗？", "友情提示", {
        confirmButtonText: "确认",
        callback: action => {
          _this.axios.delete("/menu/delete",{data:[row.id]})
                  .then(resp=>{
                    localStorage.removeItem("allMenus");
                    _this.$message.success("删除成功了！");
                    if(_this.menuses.length <= 1 && _this.queryObj.currentPage > 1){
                      _this.queryObj.currentPage = _this.queryObj.currentPage - 1;
                    }
                    _this.loadList();
                  })
        }
      })
    }
    // 提交
    submitMenu(menu: string):void{
      let _this = this;
      let el: any = this.$refs[menu];
      el.validate((valid: any) => {
        if (valid) {
          _this.loading = true;
          console.log(_this.menu.id);
          if (_this.menu.id) {
            _this.axios.put("/menu/update",_this.menu)
                    .then((resp: any) => {
                      _this.loading = false;
                      if (resp.code == 0){
                        localStorage.removeItem("allMenus");
                        _this.$message.success("修改成功了！");
                        _this.loadList();
                      }
                    })
          }else{
            _this.axios.post("/menu/save",_this.menu)
                    .then((resp: any)=>{
                      _this.loading = false;
                      if(resp.code == 0) {
                        localStorage.removeItem("allMenus");
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
    // 不提交菜单
    notSubmitMenu(menu:string):void{
      this.isList = true;
      this.menu = new Menu();
    }
    // 全部菜单
    allMenu():Promise<any>{
      let _this = this;
      return new Promise(function (resolve, reject) {
        let allMenus = localStorage.getItem("allMenus");
        if (allMenus!=null && StringUtils.isNotBlank(allMenus)) {
          _this.allMenus = JSON.parse(allMenus.toString());
          if (_this.allMenus.length != 0) {
            resolve(_this.allMenus);
          }
        }else{
          _this.axios.get("/menu/select")
                  .then((resp: any)=>{
                    _this.allMenus = resp.data;
                    localStorage.setItem("allMenus", JSON.stringify(resp.data));
                    resolve(_this.allMenus);
                  })
        }
      });
    }
    // 处理菜单
    buildMenus(): Array<Menu> {
      let _this = this;
      let arr = new Array<Menu>();
      arr = _this.allMenus;
      return arr;
    }
    // 选择父级菜单时，赋值
    setParentId(data: Menu,node: any, eml:any): void{
      this.menu.parentId = data.id;
      this.menu.parentName = data.name;
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
