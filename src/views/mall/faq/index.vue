<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="问题分类" prop="category">
        <el-select v-model="queryParams.category" placeholder="请选择问题分类" clearable size="small">
            <el-option
              v-for="dict in dict.type.ds_faq_category"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
        </el-select>
      </el-form-item>
      <el-form-item label="问题内容" prop="question">
        <el-input
          v-model.trim="queryParams.question"
          placeholder="请输入问题内容"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="排序序号" prop="sort">
        <el-input
          v-model.trim="queryParams.sort"
          placeholder="请输入排序序号"
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
          v-hasPermi="['mall:Faq:add']"
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
          v-hasPermi="['mall:Faq:edit']"
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
          v-hasPermi="['mall:Faq:remove']"
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
          v-hasPermi="['mall:Faq:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <WmsTable v-loading="loading" :data="FaqList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="问题分类" align="center" prop="category" v-if="columns[0].visible">
        <template slot-scope="scope">
            <dict-tag :options="dict.type.ds_faq_category" :value="scope.row.category"/>
        </template>
      </el-table-column>
      <el-table-column label="问题内容" align="center" prop="question" v-if="columns[1].visible"/>
      <el-table-column label="问题答案" align="center" prop="answer" v-if="columns[2].visible"/>
      <el-table-column label="排序序号" align="center" prop="sort" v-if="columns[3].visible"/>
      <el-table-column label="查看次数" align="center" prop="viewCount" v-if="columns[4].visible"/>
      <el-table-column label="状态" align="center" prop="state" v-if="columns[5].visible">
        <template slot-scope="scope">
            <dict-tag :options="dict.type.common_state" :value="scope.row.state"/>
        </template>
      </el-table-column>
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
            v-hasPermi="['mall:Faq:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['mall:Faq:remove']"
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

    <!-- 添加或修改常见问题表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="问题分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择问题分类">
            <el-option
              v-for="dict in dict.type.ds_faq_category"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题内容" prop="question">
          <el-input v-model.trim="form.question" placeholder="请输入问题内容" />
        </el-form-item>
        <el-form-item label="问题答案">
          <editor v-model="form.answer" :min-height="192"/>
        </el-form-item>
        <el-form-item label="排序序号" prop="sort">
          <el-input v-model.trim="form.sort" placeholder="请输入排序序号" />
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
import { listFaq, getFaq, delFaq, addFaq, updateFaq, exportFaq } from "@/api/mall/faq";

export default {
  name: "Faq",
  dicts: ['ds_faq_category', 'common_state'],
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
      // 常见问题表表格数据
      FaqList: [],
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
        category: null,
        question: null,
        answer: null,
        sort: null,
        createTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        category: [
          { required: true, message: "问题分类不能为空", trigger: "change" }
        ],
        question: [
          { required: true, message: "问题内容不能为空", trigger: "blur" }
        ],
        answer: [
          { required: true, message: "问题答案不能为空", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "排序序号不能为空", trigger: "blur" }
        ],
        viewCount: [
          { required: true, message: "查看次数不能为空", trigger: "blur" }
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
            { key: 1, label: "问题分类", visible:  true  },
            { key: 2, label: "问题内容", visible:  true  },
            { key: 3, label: "问题答案", visible:  true  },
            { key: 4, label: "排序序号（数字越小越靠前）", visible:  true  },
            { key: 5, label: "查看次数", visible:  true  },
            { key: 6, label: "状态", visible:  true  },
                { key: 8, label: "创建时间", visible:  true  },
             ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询常见问题表列表 */
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
      listFaq(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.FaqList = content;
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
        category: null,
        question: null,
        answer: null,
        sort: null,
        viewCount: null,
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
      this.title = "添加常见问题表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getFaq(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改常见问题表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateFaq(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addFaq(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除常见问题表编号为"' + ids + '"的数据项？').then(function() {
        return delFaq(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有常见问题表数据项？').then(() => {
        this.exportLoading = true;
        return exportFaq(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
