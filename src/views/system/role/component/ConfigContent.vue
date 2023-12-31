<template>
  <div class="role-config grid grid-cols-3 gap-x-16px">
    <div class="box">
      <div class="box-header"> 请选择菜单（可多选） </div>
      <div class="box-content">
        <div class="box-tool flex justify-between items-center px-14px border-b-1">
          <el-checkbox
            v-model="treeNodeAll"
            label="全选"
            size="large"
            @change="handleCheckedTreeNodeAll()"
          />
          <el-checkbox
            v-model="treeNodeExpand"
            label="展开/折叠"
            size="large"
            @change="handleCheckedTreeExpand()"
          />
        </div>
        <el-tree
          class="menu-tree"
          ref="treeRef"
          node-key="id"
          show-checkbox
          highlight-current
          :default-checked-keys="defaultCheckedKeys"
          :props="{ ...defaultProps, class: customNodeClass }"
          :data="treeOptions"
          @node-click="handleNodeClick"
          @check-change="handleCheckChange"
        />
      </div>
    </div>
    <div class="box">
      <div class="box-header"> 请选择操作权限（可多选） </div>
      <div class="box-content">
        <div v-if="currentNode && currentNode.type === 2">
          <div v-if="getPermissions && getPermissions.length">
            <div class="box-tool flex justify-between items-center px-14px border-b-1">
              <el-checkbox
                v-model="btnPermissionAll"
                label="全选"
                size="large"
                @change="handleCheckAllChange"
              />
            </div>
            <div class="px-14px py-10px">
              <el-checkbox-group v-model="selectedPermissions">
                <el-checkbox v-for="item in getPermissions" :key="item.id" :label="item.id">
                  {{ item.name }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div v-else class="flex justify-center text-tip mt-24px">未配置按钮</div>
        </div>
        <div v-else class="flex justify-center text-tip mt-24px">请选择菜单</div>
      </div>
    </div>
    <div class="box grid grid-rows-2">
      <div class="overflow-hidden">
        <div class="box-header"> 请选择数据权限 </div>
        <div class="box-content px-14px py-10px">
          <div v-if="currentNode && currentNode.type === 2">
            <el-radio-group v-model="currentNode.dataScope" @change="onDataScopeChange">
              <el-radio :label="5">仅看自己</el-radio>
              <el-radio :label="4">仅看本部门及以下</el-radio>
              <el-radio :label="3">仅看本部门</el-radio>
              <el-radio v-if="tenantType === TenantMap.dealer" :label="2" class="flex items-center">
                <div class="flex items-center">
                  指定部门
                  <el-tooltip placement="top">
                    <template #content>
                      <div class="max-w-300px">
                        {{ departPlaceholder }}
                      </div>
                    </template>
                    <div
                      v-if="currentNode.dataScope === 2"
                      class="depart relative inline-block w-160px pl-8px pr-16px py-2px ml-6px border-1px rounded-4px text-[var(--el-radio-text-color)] overflow-hidden"
                      @click="openDepartModal"
                    >
                      {{ departPlaceholder }}
                    </div>
                  </el-tooltip>
                </div>
              </el-radio>
              <el-radio v-if="tenantType === TenantMap.manufacturer" :label="6">
                <div class="flex items-center">
                  指定经销商
                  <el-tooltip placement="top">
                    <template #content>
                      <div class="max-w-300px">
                        {{ dealerPlaceholder }}
                      </div>
                    </template>
                    <div
                      v-if="currentNode.dataScope === 6"
                      class="depart relative inline-block w-160px pl-8px pr-16px py-2px ml-6px border-1px rounded-4px text-[var(--el-radio-text-color)] overflow-hidden"
                      @click="openMemberModal"
                    >
                      {{ dealerPlaceholder }}
                    </div>
                  </el-tooltip>
                </div>
              </el-radio>
              <el-radio :label="1">看所有人</el-radio>
            </el-radio-group>
          </div>
          <div v-else class="flex justify-center text-tip mt-24px">请选择菜单</div>
        </div>
      </div>
      <div v-if="currentNode.dataScope !== 5">
        <div class="box-header"> 请选择品牌权限 </div>
        <div class="box-content px-14px py-10px">
          <div v-if="currentNode && currentNode.type === 2">
            <el-radio-group
              class="relative w-full"
              v-model="currentNode.databrandScope"
              @change="onBrandScopeChange"
            >
              <el-radio :label="1">不限品牌</el-radio>
              <el-radio :label="2"> 指定品牌 </el-radio>
              <el-checkbox
                v-if="currentNode.databrandScope === 2"
                class="!absolute right-0 bottom-0"
                v-model="brandCheckAll"
                @change="handleBrandCheckAllChange"
              >
                全选
              </el-checkbox>
            </el-radio-group>
            <div v-show="currentNode.databrandScope === 2" class="ml-24px">
              <span v-if="selectedBrands.length === 0" class="text-error -ml-24px"
                >(请至少选择一个指定品牌)</span
              >
              <el-checkbox-group v-model="selectedBrands">
                <el-checkbox v-for="item in dictBrand" :key="item.value" :label="item.value">{{
                  item.label
                }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div v-else class="flex justify-center text-tip mt-24px">请选择菜单</div>
        </div>
      </div>
    </div>
    <SelectOrgAndStaffModal ref="selectOrgAndStaffModalRef" @confirm="onSelectOrgAndStaffConfirm" />
    <SelectBusinessModal ref="selectBusinessModalRef" @confirm="onSelectBusinessConfirm" />
  </div>
</template>

<script lang="ts" setup>
import { handleTree, defaultProps } from '@/utils/tree'
import { ElTree } from 'element-plus'
import { TreeNodeData } from 'element-plus/es/components/tree/src/tree.type'
import SelectOrgAndStaffModal from '../../organization/components/SelectOrgAndStaffModal.vue'
import SelectBusinessModal from '../../business/components/SelectBusinessModal/index.vue'
import { cloneDeep } from 'lodash-es'
import { getDictOptions } from '@/utils/dict'
import { getTenantData } from '@/utils/auth'

const message = useMessage()

const props = defineProps({
  stage: {
    required: true,
    type: String
  }
})
const emit = defineEmits(['change'])
const roleConfig = ref<any[]>([])
const tenantType = computed(() => {
  return getTenantData()?.tenantType || null
})
const TenantMap = {
  dealer: 'dealer', // 经销商
  manufacturer: 'manufacturer' // 厂家
}
// ================= 菜单 ====================
const defaultCheckedKeys = ref()
const treeOptions = ref<any[]>([]) // 菜单树形结构
const treeRef = ref<InstanceType<typeof ElTree>>()
const treeNodeAll = ref(false)
const treeNodeExpand = ref(true)
const checkedNodes = ref()

const departPlaceholder = computed(() => {
  const { dataScopeDeptIds, userIdsSelected } = currentNode.value
  return (dataScopeDeptIds && dataScopeDeptIds.length > 0) ||
    (userIdsSelected && userIdsSelected.length > 0)
    ? `已选${dataScopeDeptIds.length}个部门,${userIdsSelected.length}个人`
    : '请选择'
})
const dealerPlaceholder = computed(() => {
  const { dataScopeDealerIds, dataScopeStoreIds } = currentNode.value
  return (dataScopeDealerIds && dataScopeDealerIds.length > 0) ||
    (dataScopeStoreIds && dataScopeStoreIds.length > 0)
    ? `已选${dataScopeDealerIds.length}个经销商,${dataScopeStoreIds.length}个门店`
    : '请选择'
})
watch(
  () => checkedNodes.value,
  (data) => {
    emit('change', {
      data,
      stage: props.stage
    })
  },
  { immediate: true, deep: true }
)
// 全选/全不选
const handleCheckedTreeNodeAll = () => {
  treeRef.value!.setCheckedNodes(treeNodeAll.value ? treeOptions.value : [])
}
// 展开/折叠
/** 展开/折叠全部 */
const handleCheckedTreeExpand = () => {
  const nodes = treeRef.value?.store.nodesMap
  for (let node in nodes) {
    if (nodes[node].expanded === treeNodeExpand.value) {
      continue
    }
    nodes[node].expanded = treeNodeExpand.value
  }
}

// ================= 操作权限 ====================
const btnPermissionsOptions = ref<any[]>([]) // 按钮权限
const btnPermissionAll = computed(() => {
  return currentNode.value.operations.length === getPermissions.value.length
})
const currentNode = ref<TreeNodeData>({})
const getPermissions = computed(() => {
  return currentNode.value.type === 2
    ? btnPermissionsOptions.value.filter((item) => item.parentId === currentNode.value.id)
    : []
}) // 操作权限选项
watch(
  () => currentNode.value,
  (data, oldData) => {
    if (data.id === oldData.id) {
      if (data.dataScope || (data.operations && data.operations.length)) {
        treeRef.value!.setCheckedKeys([...treeRef.value!.getCheckedKeys(), data.id])
      } else {
        treeRef.value!.setChecked(data.id, false, true)
      }
    }
  },
  { deep: true }
)
const selectedPermissions = computed({
  get() {
    return currentNode.value.type === 2 ? currentNode.value.operations.map((item) => item.id) : []
  },
  set(val) {
    currentNode.value.operations = getPermissions.value.filter((item) => val.includes(item.id))
  }
}) // 选中select操作权限

const customNodeClass = (data) => {
  if (data.dataScope || (data.operations && data.operations.length)) {
    return 'custom-highlight'
  }
  return null
}

const handleCheckAllChange = (val: boolean) => {
  currentNode.value.operations = val ? getPermissions.value : []
}
const handleNodeClick = (node) => {
  currentNode.value = node
}
const handleCheckChange = (node) => {
  currentNode.value = node
  treeRef.value!.setCurrentKey(node.id, true)
  checkedNodes.value = treeRef.value!.getCheckedNodes()
}

// ================= 数据权限 ====================
const selectOrgAndStaffModalRef = ref()
const selectBusinessModalRef = ref()
const dictBrand = ref(getDictOptions('brand'))
const brandCheckAll = computed(() => {
  return currentNode.value.dataScopeBrandIds
    ? currentNode.value.dataScopeBrandIds.length === dictBrand.value.length
    : false
})
const selectedBrands = computed({
  get() {
    return currentNode.value.type === 2 ? currentNode.value.dataScopeBrandIds : []
  },
  set(val) {
    currentNode.value.dataScopeBrandIds = val
  }
}) // 选中select操作权限
// 指定部门选择
const openDepartModal = () => {
  const { dataScopeDeptIds, userIdsSelected } = currentNode.value
  selectOrgAndStaffModalRef.value.openModal(dataScopeDeptIds, userIdsSelected)
}
const onSelectOrgAndStaffConfirm = (dataScopeDepts, dataScopeUsers) => {
  currentNode.value.dataScopeDeptIds = dataScopeDepts.map((item) => item.id)
  currentNode.value.dataScopeDepts = dataScopeDepts
  currentNode.value.dataScopeUsers = dataScopeUsers.map((item) => {
    return { id: item.id, nickname: item.name, username: item.account }
  })
  currentNode.value.userIdsSelected = dataScopeUsers.map((item) => item.id)
  currentNode.value.users = dataScopeUsers.map((item) => {
    return { id: item.id, deptId: item.parentId }
  })
}
// 选择经销商
const openMemberModal = () => {
  const { dataScopeStoreIds, dataScopeDealerIds } = currentNode.value
  selectBusinessModalRef.value.openModal([...dataScopeDealerIds, ...dataScopeStoreIds])
}
const onSelectBusinessConfirm = (dealers, stores) => {
  currentNode.value.dataScopeStoreIds = stores.map((item) => item.id)
  currentNode.value.dataScopeStores = stores.map((item) => {
    return {
      id: item.id,
      name: item.name
    }
  })
  currentNode.value.dataScopeDealerIds = dealers.map((item) => item.id)
  currentNode.value.dataScopeDealers = dealers.map((item) => {
    return {
      id: item.id,
      name: item.name
    }
  })
}
const handleBrandCheckAllChange = (val: boolean) => {
  currentNode.value.dataScopeBrandIds = val ? dictBrand.value.map((item) => item.value) : []
}
const onBrandScopeChange = (value) => {
  if (value === 1) currentNode.value.dataScopeBrandIds = []
}
const onDataScopeChange = (value) => {
  if (value === 5) {
    currentNode.value['databrandScope'] = 1
    currentNode.value['dataScopeBrandIds'] = []
  }
}

// ================= 初始化 ====================
const init = async (menu, config) => {
  if (!menu) return
  btnPermissionsOptions.value = menu.filter((menu) => menu.type === 3)
  roleConfig.value = config || []
  defaultCheckedKeys.value = roleConfig.value
    .filter((item) => item.type === 2)
    .map((item) => item.menuId)
  treeOptions.value = handleTree(
    menu.filter((menu) => {
      if (menu.type === 2) {
        const roleData = roleConfig.value.find((item) => item.menuId === menu.id)
        menu.operations = roleData?.operations || []
        menu.dataScope = roleData?.dataScope || ''
        menu.dataScopeDeptIds = roleData?.dataScopeDeptIds || []
        menu.dataScopeDepts = roleData?.dataScopeDepts || []
        menu.userIdsSelected = roleData?.userIdsSelected || []
        menu.dataScopeUsers = roleData?.dataScopeUsers || []
        menu.users = roleData?.users || []
        menu.dataScopeStoreIds = roleData?.dataScopeStoreIds || []
        menu.dataScopeStores = roleData?.dataScopeStores || []
        menu.dataScopeBrandIds = roleData?.dataScopeBrandIds || []
        menu.dataScopeDealerIds = roleData?.dataScopeDealerIds || []
        menu.dataScopeDealers = roleData?.dataScopeDealers || []
        menu.databrandScope =
          roleData?.dataScopeBrandIds && roleData?.dataScopeBrandIds.length > 0 ? 2 : 1
      }
      return menu.type !== 3
    })
  )
  nextTick(() => {
    checkedNodes.value = treeRef.value!.getCheckedNodes()
    handleCheckedTreeExpand()
  })
}

const getParams = () => {
  const menuDataScopeItemList = cloneDeep(treeRef.value!.getCheckedNodes(false, true))
  return menuDataScopeItemList.map((item) => {
    if (item.databrandScope === 2 && item.dataScopeBrandIds.length === 0) {
      message.error(`${item.name} 菜单未选择指定品牌`)
      throw new Error(`${item.name} 菜单未选择指定品牌`)
    }
    // type === 2 菜单
    if (item.type === 2 && !item.dataScope) {
      message.error(`${item.name} 菜单未选择数据权限`)
      throw new Error(`${item.name} 菜单未选择数据权限`)
    }
    item['menuId'] = item.id
    item['menuParentId'] = item.parentId
    delete item.children
    if (item.dataScope === 2) {
      item.dataScopeStoreIds = []
      item.dataScopeStores = []
      item.dataScopeDealerIds = []
      item.dataScopeDealers = []
    } else if (item.dataScope === 6) {
      // 指定人清空部门
      // 部门清空指定人
      item.userIdsSelected = []
      item.users = []
      item.dataScopeUsers = []
      item.dataScopeDeptIds = []
      item.dataScopeDepts = []
    }
    item.dataScopeBrandIds = item.databrandScope === 2 ? item.dataScopeBrandIds : []
    return item
  })
}

defineExpose({ getParams, init }) // 提供 openModal 方法，用于打开弹窗
</script>

<style lang="scss" scoped>
.role-config {
  .box {
    height: 100%;
    overflow: hidden;
    border: 1px solid #eaebef;
    border-radius: 2px;
  }

  .box-header {
    padding: 10px 14px;
    background-color: var(--table-bg-color);
  }

  .box-tool {
    border-bottom: 1px solid #eaebef;
  }

  .box-content {
    height: calc(100% - 42px);
  }

  .box-content .el-radio-group {
    align-items: normal;
    flex-flow: column nowrap;
  }

  .menu-tree {
    height: calc(100% - 42px);
    overflow-y: scroll;
  }

  .depart {
    text-overflow: ellipsis;
    border-color: #eaebef;

    &::after {
      position: absolute;
      top: 50%;
      right: 8px;
      font-family: iconfont;
      font-size: 12px;
      color: var(--el-color-info);
      content: '\e68f';
      transform: translateY(-50%);
    }
  }

  :deep(.el-tree .el-tree-node.custom-highlight > .el-tree-node__content) {
    color: var(--el-color-primary);
    background-color: #ebf5ff;
  }

  :deep(.el-tree .el-tree-node.is-current > .el-tree-node__content) {
    background-color: #c1e0ff;
  }
}
</style>
