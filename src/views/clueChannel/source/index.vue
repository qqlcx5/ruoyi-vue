<template>
  <div class="basic-config-content club-source-main">
    <div class="part-title">
      <span class="main-text">线索来源管理</span>
    </div>
    <div class="part-content">
      <div class="source">
        <div class="source-column" v-for="(item, index) in sourceList" :key="index">
          <div class="header">
            <span class="title">{{ levelList[index] }}级来源</span>
            <span class="add-bnt" @click="addSource(index)">添加{{ levelList[index] }}级来源</span>
          </div>
          <div class="content">
            <div
              class="list-row"
              :class="{ active: item.checkedData.sourceCode == lItem.sourceCode }"
              v-for="(lItem, lIndex) in item.list"
              :key="lIndex"
              @click="selectedSource(lItem, index)"
            >
              <span class="label">{{ lItem.sourceName }}</span>
              <div class="bnt-wrap">
                <XTextButton :title="t('action.edit')" @click.stop="handleEdit(lItem, index)" />
                <XTextButton :title="t('action.del')" @click.stop="handledelete(lItem)" />
                <i class="iconfont icon-you" v-if="index < levelList.length - 1"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="source-column" key="666" v-if="showTisColumnTool">
          <div class="header">
            <span class="title">{{ levelList[sourceList.length] }}级来源</span>
          </div>
          <div class="content">
            <span class="text-tip">请从左侧选择</span>
          </div>
        </div>
      </div>
    </div>
    <AddSourceModal ref="addSourceModalRef" @refresh-list="getSourceList" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AddSourceModal from './components/AddSourceModal.vue'
import * as channelApi from '@/api/clue/channel'
import { cloneDeep } from 'lodash-es'
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
let levelList = ['一', '二', '三', '四', '五']
let sourceList = ref<any[]>([])
let currentIndex = ref<number>(-999)
let showTisColumnTool = ref(true)

watch(sourceList, (sourceList: any) => {
  let index: number = currentIndex.value
  let key = index + 1
  let list = []
  if (sourceList.length < key) {
    list = sourceList[key].list
  }
  let tool = true
  if (list.length == 0) {
    tool = false
  }
  if (sourceList.length == levelList.length) {
    tool = false
  }
  showTisColumnTool.value = tool
})

// 获取线索来源列表
const getSourceList = async () => {
  let data = await channelApi.getClueSourceManageList()
  // data = []
  if (data) {
    let oldSourceList: any[] = []
    if (sourceList.value.length > 1) {
      oldSourceList = cloneDeep(sourceList.value)
    } else {
      currentIndex.value = -1
    }
    sourceList.value = [{ checkedData: {}, list: data }]
    let list = data
    oldSourceList.forEach((item: any, index) => {
      let children = []
      list.forEach((fItem) => {
        if (fItem.sourceCode == item.checkedData.sourceCode) {
          selectedSource(fItem, index)
          children = fItem.children
        }
      })
      list = children
    })
    console.log('数据源===', sourceList.value)
  }
}
getSourceList()

const selectedSource = (lItem, index) => {
  try {
    currentIndex.value = index
    sourceList.value[index].checkedData = lItem
    sourceList.value = sourceList.value.slice(0, index + 1)
    if (index < levelList.length - 1) {
      // 最后一级不加

      let children = lItem.children || []
      sourceList.value.push({ checkedData: {}, list: children })
    }
  } catch (error) {
    console.log(error)
  }
}
const addSourceModalRef = ref()
const addSource = (index: number) => {
  let data: any = {}
  if (index > 0) {
    data = sourceList.value[index - 1].checkedData
  }
  data.sourceHierarchy = index + 1
  data.levelList = levelList
  addSourceModalRef.value.openModal(data, 'add')
}
const handleEdit = (lItem, lIndex) => {
  console.log(lItem, lIndex)
  lItem.levelList = levelList
  addSourceModalRef.value.openModal(lItem, 'edit')
}
const handledelete = (lItem) => {
  console.log(lItem)
  let params = { id: lItem.id }
  message
    .confirm('确认删除该数据吗？', t('common.reminder'))
    .then(async () => {
      let data = await channelApi.clueSourceManageDelete(params)
      if (data) {
        message.success('删除成功')
        getSourceList()
      }
    })
    .catch(() => {})
}
</script>

<style lang="scss" scoped>
.club-source-main {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 22px 30px;
  background-color: var(--page-bg-color);
  .part-title {
    padding-bottom: 10px;
    border-bottom: 1px solid $border-color;
    margin-bottom: 20px;
    line-height: 25px;
    .main-text {
      font-size: 18px;
      font-weight: bold;
      color: $title-color;
      margin-right: 6px;
    }
    .sub-text {
      font-size: 14px;
      color: $tip-color;
    }
  }
  .part-content {
    flex: 1;
    display: flex;
    overflow-y: hidden;
    overflow-x: auto;
    .source {
      display: flex;
      border: 1px solid $border-color;
      .source-column {
        width: 368px;
        border-right: 1px solid $border-color;
        display: flex;
        flex-direction: column;
        .cell {
          height: 36px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .header {
          @extend .cell;
          padding: 0 18px;
          height: 50px;
          background-color: #f6f6f6;
          .title {
            color: #333333;
            font-weight: bold;
          }
          .add-bnt {
            cursor: pointer;
            color: #1989fa;
          }
        }
        .content {
          position: relative;
          flex: 1;
          overflow: auto;
          .list-row {
            @extend .cell;
            padding-left: 18px;
            padding-right: 12px;
            cursor: pointer;
            .label {
              padding-right: 10px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .bnt-wrap {
              display: flex;
              align-items: center;
            }
          }
          .active {
            color: #1989fa;
            background-color: #ebf5ff;
          }
          .text-tip {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 20px;
          }
          &::-webkit-scrollbar {
            display: none;
          }
        }
        &:last-child {
          border: 0;
        }
      }
    }
  }
}
</style>
