<template>
  <el-card class="dispatch-rule-container" :gutter="12" shadow="never">
    <el-form :model="searchForm" class="wg-query-form w-full" ref="elFormRef" label-position="left">
      <el-row :gutter="12">
        <el-col :span="6">
          <el-form-item label="考核规则名称">
            <el-input v-model="searchForm.rulename" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="门店">
            <el-input v-model="searchForm.shopId" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="6" class="!flex flex-column justify-between">
          <div>
            <el-button type="primary">查询</el-button>
            <el-button>重置</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script setup lang="ts" name="dispatchRule">
const searchForm = ref({ rulename: '', shopId: '' })
</script>

<style lang="scss" scoped></style>