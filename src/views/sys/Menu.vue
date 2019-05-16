<template>
  <div class="backdrop" v-loading="loading">
    <div v-show="islist">
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
      <el-table :data="menuses" style="width: 100%" height="360" border
                @sort-change="solrLoadMenusess"
                @selection-change="electRow">
        <!--多选框-->
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column sortable="custom" prop="id" label="ID" width="80"></el-table-column>
        <el-table-column sortable="custom" prop="name" label="名称" width="120"></el-table-column>
        <el-table-column sortable="custom" prop="path" label="链接" width="180"></el-table-column>
        <el-table-column sortable="custom" prop="type" label="类型" width="180">
          <template slot-scope="scope">
            <el-tag type="success" size="medium" v-if="scope.row.type == 1">菜单</el-tag>
            <el-tag type="info" size="medium" v-if="scope.row.type == 2">按钮</el-tag>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" prop="permission" label="权限" width="180"></el-table-column>
        <el-table-column label="操作">
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
          :page-sizes="[10, 20, 30, 40]"
          :page-size="queryObj.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="queryObj.total">
      </el-pagination>
    </div>

    <div v-show="!islist">
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
              <el-option label="菜单" value="1"></el-option>
              <el-option label="按钮" value="2"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item prop="path" label="菜单路由" v-if="menu.type == 1">
          <el-col :span="10">
            <el-input v-model="menu.path"></el-input>
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
            <el-input v-model="menu.iconCls"></el-input>
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

  @Component({})
  export default class Menu extends Vue {

  }
</script>

<style scoped>

</style>
