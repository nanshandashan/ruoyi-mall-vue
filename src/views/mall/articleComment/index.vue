<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="文章ID" prop="articleId">
        <el-input
          v-model.trim="queryParams.articleId"
          placeholder="请输入文章ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="父评论ID" prop="parentId">
        <el-input
          v-model.trim="queryParams.parentId"
          placeholder="请输入父评论ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="评论会员ID" prop="memberId">
        <el-input
          v-model.trim="queryParams.memberId"
          placeholder="请输入评论会员ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="被回复会员ID" prop="replyToMemberId">
        <el-input
          v-model.trim="queryParams.replyToMemberId"
          placeholder="请输入被回复会员ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-input
          v-model.trim="queryParams.state"
          placeholder="请输入状态"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['mall:ArticleComment:add']"
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
          v-hasPermi="['mall:ArticleComment:edit']"
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
          v-hasPermi="['mall:ArticleComment:remove']"
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
          v-hasPermi="['mall:ArticleComment:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <WmsTable v-loading="loading" :data="ArticleCommentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="文章ID" align="center" prop="articleId" v-if="columns[0].visible"/>
      <el-table-column label="父评论ID" align="center" prop="parentId" v-if="columns[1].visible"/>
      <el-table-column label="评论会员ID" align="center" prop="memberId" v-if="columns[2].visible"/>
      <el-table-column label="评论内容" align="center" prop="content" v-if="columns[3].visible"/>
      <el-table-column label="被回复会员ID" align="center" prop="replyToMemberId" v-if="columns[4].visible"/>
      <el-table-column label="状态" align="center" prop="state" v-if="columns[5].visible"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" v-if="columns[6].visible">
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
            v-hasPermi="['mall:ArticleComment:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['mall:ArticleComment:remove']"
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

    <!-- 添加或修改文章评论表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="文章ID" prop="articleId">
          <el-input v-model.trim="form.articleId" placeholder="请输入文章ID" />
        </el-form-item>
        <el-form-item label="父评论ID" prop="parentId">
          <el-input v-model.trim="form.parentId" placeholder="请输入父评论ID" />
        </el-form-item>
        <el-form-item label="评论会员ID" prop="memberId">
          <el-input v-model.trim="form.memberId" placeholder="请输入评论会员ID" />
        </el-form-item>
        <el-form-item label="评论内容">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="被回复会员ID" prop="replyToMemberId">
          <el-input v-model.trim="form.replyToMemberId" placeholder="请输入被回复会员ID" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-input v-model.trim="form.state" placeholder="请输入状态" />
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
import { listArticleComment, getArticleComment, delArticleComment, addArticleComment, updateArticleComment, exportArticleComment } from "@/api/mall/articleComment";

export default {
  name: "ArticleComment",
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
      // 文章评论表表格数据
      ArticleCommentList: [],
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
        articleId: null,
        parentId: null,
        memberId: null,
        content: null,
        replyToMemberId: null,
        state: null,
        createTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        articleId: [
          { required: true, message: "文章ID不能为空", trigger: "blur" }
        ],
        parentId: [
          { required: true, message: "父评论ID不能为空", trigger: "blur" }
        ],
        memberId: [
          { required: true, message: "评论会员ID不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "评论内容不能为空", trigger: "blur" }
        ],
        replyToMemberId: [
          { required: true, message: "被回复会员ID不能为空", trigger: "blur" }
        ],
        state: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        updateTime: [
          { required: true, message: "修改时间不能为空", trigger: "blur" }
        ]
      },
      columns: [
            { key: 1, label: "文章ID（关联ds_article.id）", visible:  true  },
            { key: 2, label: "父评论ID（0-一级评论，&gt;0-子评论，关联本表id）", visible:  true  },
            { key: 3, label: "评论会员ID", visible:  true  },
            { key: 4, label: "评论内容", visible:  true  },
            { key: 5, label: "被回复会员ID（子评论时有效）", visible:  true  },
            { key: 6, label: "状态（0-显示，1-隐藏/审核不通过）", visible:  true  },
                { key: 8, label: "创建时间", visible:  true  },
             ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询文章评论表列表 */
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
      listArticleComment(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.ArticleCommentList = content;
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
        articleId: null,
        parentId: null,
        memberId: null,
        content: null,
        replyToMemberId: null,
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
      this.title = "添加文章评论表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getArticleComment(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改文章评论表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateArticleComment(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addArticleComment(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除文章评论表编号为"' + ids + '"的数据项？').then(function() {
        return delArticleComment(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有文章评论表数据项？').then(() => {
        this.exportLoading = true;
        return exportArticleComment(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
