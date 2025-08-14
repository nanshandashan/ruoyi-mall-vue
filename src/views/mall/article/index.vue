<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="分类id" prop="categoryId">
        <el-select v-model="queryParams.categoryId" placeholder="请选择分类id" clearable size="small">
              <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input
          v-model.trim="queryParams.title"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="queryParams.state" placeholder="请选择状态" clearable size="small">
            <el-option
              v-for="dict in dict.type.common_state"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
                v-model="daterangeCreateTime"
                size="small"
                style="width: 240px"
                value-format="yyyy-MM-ddTHH:mm:ss"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"/>
      </el-form-item>
      <el-form-item class="flex_one tr">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['mall:Article:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['mall:Article:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['mall:Article:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['mall:Article:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <WmsTable v-loading="loading" :data="ArticleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="分类id" align="center" prop="categoryId" v-if="columns[0].visible"/>
      <el-table-column label="标题" align="center" prop="title" v-if="columns[1].visible"/>
      <el-table-column label="简介" align="center" prop="summary" v-if="columns[2].visible"/>
      <el-table-column label="小图" align="center" prop="imageSmall" v-if="columns[3].visible"/>
      <el-table-column label="大图" align="center" prop="imageBig" v-if="columns[4].visible"/>
      <el-table-column label="内容" align="center" prop="content" v-if="columns[5].visible"/>
      <el-table-column label="点赞数" align="center" prop="likeCount" v-if="columns[6].visible"/>
      <el-table-column label="评论数" align="center" prop="commentCount" v-if="columns[7].visible"/>
      <el-table-column label="分享数" align="center" prop="shareCount" v-if="columns[8].visible"/>
      <el-table-column label="收藏数" align="center" prop="collectCount" v-if="columns[9].visible"/>
      <el-table-column label="状态" align="center" prop="state" v-if="columns[10].visible">
        <template slot-scope="scope">
            <dict-tag :options="dict.type.common_state" :value="scope.row.state"/>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" v-if="columns[11].visible">
        <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime, '')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['mall:Article:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['mall:Article:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </WmsTable>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改文章表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="分类id" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="请选择分类id">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model.trim="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="简介" prop="summary">
          <el-input v-model="form.summary" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="小图" prop="imageSmall">
          <el-input v-model.trim="form.imageSmall" placeholder="请输入小图" />
        </el-form-item>
        <el-form-item label="大图" prop="imageBig">
          <el-input v-model.trim="form.imageBig" placeholder="请输入大图" />
        </el-form-item>
        <el-form-item label="内容">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="点赞数" prop="likeCount">
          <el-input v-model.trim="form.likeCount" placeholder="请输入点赞数" />
        </el-form-item>
        <el-form-item label="评论数" prop="commentCount">
          <el-input v-model.trim="form.commentCount" placeholder="请输入评论数" />
        </el-form-item>
        <el-form-item label="分享数" prop="shareCount">
          <el-input v-model.trim="form.shareCount" placeholder="请输入分享数" />
        </el-form-item>
        <el-form-item label="收藏数" prop="collectCount">
          <el-input v-model.trim="form.collectCount" placeholder="请输入收藏数" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="form.state" placeholder="请选择状态">
            <el-option
              v-for="dict in dict.type.common_state"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listArticle, getArticle, delArticle, addArticle, updateArticle, exportArticle } from "@/api/mall/article";

export default {
  name: "Article",
  dicts: ['common_state'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 文章表表格数据
      ArticleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态时间范围
      daterangeCreateTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        categoryId: null,
        title: null,
        state: null,
        createTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        categoryId: [
          { required: true, message: "分类id不能为空", trigger: "change" }
        ],
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
        summary: [
          { required: true, message: "简介不能为空", trigger: "blur" }
        ],
        imageSmall: [
          { required: true, message: "小图不能为空", trigger: "blur" }
        ],
        imageBig: [
          { required: true, message: "大图不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "内容不能为空", trigger: "blur" }
        ],
        likeCount: [
          { required: true, message: "点赞数不能为空", trigger: "blur" }
        ],
        commentCount: [
          { required: true, message: "评论数不能为空", trigger: "blur" }
        ],
        shareCount: [
          { required: true, message: "分享数不能为空", trigger: "blur" }
        ],
        collectCount: [
          { required: true, message: "收藏数不能为空", trigger: "blur" }
        ],
        state: [
          { required: true, message: "状态不能为空", trigger: "change" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        updateTime: [
          { required: true, message: "修改时间不能为空", trigger: "blur" }
        ]
      },
      columns: [
            { key: 1, label: "分类id", visible:  true  },
            { key: 2, label: "标题", visible:  true  },
            { key: 3, label: "简介", visible:  true  },
            { key: 4, label: "小图", visible:  true  },
            { key: 5, label: "大图", visible:  true  },
            { key: 6, label: "内容", visible:  true  },
            { key: 7, label: "点赞数", visible:  true  },
            { key: 8, label: "评论数", visible:  true  },
            { key: 9, label: "分享数", visible:  true  },
            { key: 10, label: "收藏数", visible:  false  },
            { key: 11, label: "状态", visible:  false  },
                { key: 13, label: "创建时间", visible:  false  },
             ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询文章表列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
        this.queryParams.params["beginCreateTime"] = this.daterangeCreateTime[0];
        this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
      }
      const {pageNum, pageSize} = this.queryParams;
      const query = {...this.queryParams, pageNum: undefined, pageSize: undefined};
      const pageReq = {page: pageNum - 1, size: pageSize};
      listArticle(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.ArticleList = content;
        this.total = totalElements;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        categoryId: null,
        title: null,
        summary: null,
        imageSmall: null,
        imageBig: null,
        content: null,
        likeCount: null,
        commentCount: null,
        shareCount: null,
        collectCount: null,
        state: null,
        createTime: null,
        updateTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeCreateTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加文章表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getArticle(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改文章表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateArticle(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addArticle(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除文章表编号为"' + ids + '"的数据项？').then(function() {
        return delArticle(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有文章表数据项？').then(() => {
        this.exportLoading = true;
        return exportArticle(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
