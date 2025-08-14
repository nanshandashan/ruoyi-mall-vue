<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="岗位名称" prop="jobName">
        <el-input
          v-model.trim="queryParams.jobName"
          placeholder="请输入岗位名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="投递邮箱" prop="email">
        <el-input
          v-model.trim="queryParams.email"
          placeholder="请输入投递邮箱"
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
          v-hasPermi="['mall:JobDetail:add']"
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
          v-hasPermi="['mall:JobDetail:edit']"
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
          v-hasPermi="['mall:JobDetail:remove']"
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
          v-hasPermi="['mall:JobDetail:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <WmsTable v-loading="loading" :data="JobDetailList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="岗位名称" align="center" prop="jobName" v-if="columns[0].visible"/>
      <el-table-column label="岗位简介" align="center" prop="jobIntro" v-if="columns[1].visible"/>
      <el-table-column label="岗位职责" align="center" prop="jobResponsibility" v-if="columns[2].visible"/>
      <el-table-column label="任职要求" align="center" prop="jobRequirement" v-if="columns[3].visible"/>
      <el-table-column label="工作所在城市" align="center" prop="city" v-if="columns[4].visible"/>
      <el-table-column label="所属部门" align="center" prop="department" v-if="columns[5].visible"/>
      <el-table-column label="投递邮箱" align="center" prop="email" v-if="columns[6].visible"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" v-if="columns[7].visible">
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
            v-hasPermi="['mall:JobDetail:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['mall:JobDetail:remove']"
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

    <!-- 添加或修改招聘表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="岗位名称" prop="jobName">
          <el-input v-model.trim="form.jobName" placeholder="请输入岗位名称" />
        </el-form-item>
        <el-form-item label="岗位简介" prop="jobIntro">
          <el-input v-model="form.jobIntro" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="岗位职责" prop="jobResponsibility">
          <el-input v-model="form.jobResponsibility" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="任职要求" prop="jobRequirement">
          <el-input v-model="form.jobRequirement" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="工作所在城市" prop="city">
          <el-input v-model.trim="form.city" placeholder="请输入工作所在城市" />
        </el-form-item>
        <el-form-item label="所属部门" prop="department">
          <el-input v-model.trim="form.department" placeholder="请输入所属部门" />
        </el-form-item>
        <el-form-item label="投递邮箱" prop="email">
          <el-input v-model.trim="form.email" placeholder="请输入投递邮箱" />
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
import { listJobDetail, getJobDetail, delJobDetail, addJobDetail, updateJobDetail, exportJobDetail } from "@/api/mall/jobDetail";

export default {
  name: "JobDetail",
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
      // 招聘表表格数据
      JobDetailList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 投递邮箱时间范围
      daterangeCreateTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        jobName: null,
        email: null,
        createTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        jobName: [
          { required: true, message: "岗位名称不能为空", trigger: "blur" }
        ],
        jobIntro: [
          { required: true, message: "岗位简介不能为空", trigger: "blur" }
        ],
        jobResponsibility: [
          { required: true, message: "岗位职责不能为空", trigger: "blur" }
        ],
        jobRequirement: [
          { required: true, message: "任职要求不能为空", trigger: "blur" }
        ],
        city: [
          { required: true, message: "工作所在城市不能为空", trigger: "blur" }
        ],
        department: [
          { required: true, message: "所属部门不能为空", trigger: "blur" }
        ],
        email: [
          { required: true, message: "投递邮箱不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        updateTime: [
          { required: true, message: "修改时间不能为空", trigger: "blur" }
        ]
      },
      columns: [
            { key: 1, label: "岗位名称", visible:  true  },
            { key: 2, label: "岗位简介", visible:  true  },
            { key: 3, label: "岗位职责", visible:  true  },
            { key: 4, label: "任职要求", visible:  true  },
            { key: 5, label: "工作所在城市", visible:  true  },
            { key: 6, label: "所属部门", visible:  true  },
            { key: 7, label: "投递邮箱", visible:  true  },
                { key: 9, label: "创建时间", visible:  true  },
             ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询招聘表列表 */
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
      listJobDetail(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.JobDetailList = content;
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
        jobName: null,
        jobIntro: null,
        jobResponsibility: null,
        jobRequirement: null,
        city: null,
        department: null,
        email: null,
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
      this.title = "添加招聘表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getJobDetail(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改招聘表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateJobDetail(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addJobDetail(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除招聘表编号为"' + ids + '"的数据项？').then(function() {
        return delJobDetail(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有招聘表数据项？').then(() => {
        this.exportLoading = true;
        return exportJobDetail(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
