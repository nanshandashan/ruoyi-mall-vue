<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" size="medium" class="ry_form">
      <el-form-item label="活动名称" prop="title">
        <el-input
          v-model.trim="queryParams.title"
          placeholder="请输入活动名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="活动开始时间" prop="beginTime">
        <el-date-picker
            clearable
            size="small"
            v-model="queryParams.beginTime"
            type="datetime"
            value-format="yyyy-MM-ddTHH:mm:ss"
            placeholder="选择活动开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="活动结束时间" prop="endTime">
        <el-date-picker
            clearable
            size="small"
            v-model="queryParams.endTime"
            type="datetime"
            value-format="yyyy-MM-ddTHH:mm:ss"
            placeholder="选择活动结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="报名时间" prop="signUpTime">
        <el-date-picker
            clearable
            size="small"
            v-model="queryParams.signUpTime"
            type="datetime"
            value-format="yyyy-MM-ddTHH:mm:ss"
            placeholder="选择报名时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="报名截止时间" prop="signUpEndTime">
        <el-date-picker
            clearable
            size="small"
            v-model="queryParams.signUpEndTime"
            type="datetime"
            value-format="yyyy-MM-ddTHH:mm:ss"
            placeholder="选择报名截止时间">
        </el-date-picker>
      </el-form-item>
      <template v-if="showMoreCondition">
      <el-form-item label="活动地址" prop="address">
        <el-input
          v-model.trim="queryParams.address"
          placeholder="请输入活动地址"
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
    </template>
      <el-form-item class="flex_one tr">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button :icon="showMoreCondition ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" size="mini" @click="showMoreCondition = !showMoreCondition">{{showMoreCondition ? '收起条件' : '展开条件'}}</el-button>
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
          v-hasPermi="['mall:Activity:add']"
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
          v-hasPermi="['mall:Activity:edit']"
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
          v-hasPermi="['mall:Activity:remove']"
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
          v-hasPermi="['mall:Activity:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <WmsTable v-loading="loading" :data="ActivityList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="活动名称" align="center" prop="title" v-if="columns[0].visible"/>
      <el-table-column label="简介" align="center" prop="summary" v-if="columns[1].visible"/>
      <el-table-column label="主图" align="center" prop="image" v-if="columns[2].visible"/>
      <el-table-column label="活动开始时间" align="center" prop="beginTime" width="180" v-if="columns[3].visible">
        <template slot-scope="scope">
            <span>{{ parseTime(scope.row.beginTime, '')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动结束时间" align="center" prop="endTime" width="180" v-if="columns[4].visible">
        <template slot-scope="scope">
            <span>{{ parseTime(scope.row.endTime, '')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="报名时间" align="center" prop="signUpTime" width="180" v-if="columns[5].visible">
        <template slot-scope="scope">
            <span>{{ parseTime(scope.row.signUpTime, '')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="报名截止时间" align="center" prop="signUpEndTime" width="180" v-if="columns[6].visible">
        <template slot-scope="scope">
            <span>{{ parseTime(scope.row.signUpEndTime, '')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动地址" align="center" prop="address" v-if="columns[7].visible"/>
      <el-table-column label="活动内容" align="center" prop="content" v-if="columns[8].visible"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" v-if="columns[9].visible">
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
            v-hasPermi="['mall:Activity:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['mall:Activity:remove']"
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

    <!-- 添加或修改活动表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="108px" inline class="dialog-form-two">
        <el-form-item label="活动名称" prop="title">
          <el-input v-model.trim="form.title" placeholder="请输入活动名称" />
        </el-form-item>
        <el-form-item label="简介" prop="summary">
          <el-input v-model="form.summary" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="主图">
          <imageUpload v-model="form.image"/>
        </el-form-item>
        <el-form-item label="活动开始时间" prop="beginTime">
          <el-date-picker clearable size="small"
                        v-model="form.beginTime"
                        type="datetime"
                        value-format="yyyy-MM-ddTHH:mm:ss"
                        placeholder="选择活动开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动结束时间" prop="endTime">
          <el-date-picker clearable size="small"
                        v-model="form.endTime"
                        type="datetime"
                        value-format="yyyy-MM-ddTHH:mm:ss"
                        placeholder="选择活动结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报名时间" prop="signUpTime">
          <el-date-picker clearable size="small"
                        v-model="form.signUpTime"
                        type="datetime"
                        value-format="yyyy-MM-ddTHH:mm:ss"
                        placeholder="选择报名时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报名截止时间" prop="signUpEndTime">
          <el-date-picker clearable size="small"
                        v-model="form.signUpEndTime"
                        type="datetime"
                        value-format="yyyy-MM-ddTHH:mm:ss"
                        placeholder="选择报名截止时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动地址" prop="address">
          <el-input v-model.trim="form.address" placeholder="请输入活动地址" />
        </el-form-item>
        <el-form-item label="活动内容">
          <editor v-model="form.content" :min-height="192"/>
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
import { listActivity, getActivity, delActivity, addActivity, updateActivity, exportActivity } from "@/api/mall/activity";

export default {
  name: "Activity",
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
      // 活动表表格数据
      ActivityList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 活动内容时间范围
      daterangeCreateTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: null,
        summary: null,
        image: null,
        beginTime: null,
        endTime: null,
        signUpTime: null,
        signUpEndTime: null,
        address: null,
        createTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "活动名称不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        updateTime: [
          { required: true, message: "修改时间不能为空", trigger: "blur" }
        ]
      },
      columns: [
            { key: 1, label: "活动名称", visible:  true  },
            { key: 2, label: "简介", visible:  true  },
            { key: 3, label: "主图", visible:  false  },
            { key: 4, label: "活动开始时间", visible:  true  },
            { key: 5, label: "活动结束时间", visible:  true  },
            { key: 6, label: "报名时间", visible:  true  },
            { key: 7, label: "报名截止时间", visible:  true  },
            { key: 8, label: "活动地址", visible:  true  },
            { key: 9, label: "活动内容", visible:  true  },
                { key: 11, label: "创建时间", visible:  false  },
             ],
      showMoreCondition: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询活动表列表 */
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
      listActivity(query, pageReq).then(response => {
        const { content, totalElements } = response
        this.ActivityList = content;
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
        title: null,
        summary: null,
        image: null,
        beginTime: null,
        endTime: null,
        signUpTime: null,
        signUpEndTime: null,
        address: null,
        content: null,
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
      this.title = "添加活动表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getActivity(id).then(response => {
        this.form = response;
        this.open = true;
        this.title = "修改活动表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateActivity(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addActivity(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除活动表编号为"' + ids + '"的数据项？').then(function() {
        return delActivity(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$modal.confirm('是否确认导出所有活动表数据项？').then(() => {
        this.exportLoading = true;
        return exportActivity(queryParams);
      }).then(response => {
        this.$download.download(response);
        this.exportLoading = false;
      }).catch(() => {});
    }
  }
};
</script>
