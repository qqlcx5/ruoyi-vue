<script setup lang="ts">
import { useTagsViewStore } from '@/store/modules/tagsView'
import { useAppStore } from '@/store/modules/app'
import { Footer } from '@/layout/components/Footer'
import { TagsView } from '@/layout/components/TagsView'
import { computed } from 'vue'

import EditUserInfo from '@/components/EditUerInfo/EditUserInfo.vue'

const appStore = useAppStore()

const layout = computed(() => appStore.getLayout)

const fixedHeader = computed(() => appStore.getFixedHeader)

const footer = computed(() => appStore.getFooter)

// const collapse = computed(() => appStore.getCollapse)
//
// const fixedMenu = computed(() => appStore.getFixedMenu)

const tagsViewStore = useTagsViewStore()

const getCaches = computed((): string[] => {
  return tagsViewStore.getCachedViews
})

const state = reactive({
  isShow: false
})
watch(
  () => appStore.getIsShowEditUserInfo,
  (val) => {
    nextTick(() => {
      state.isShow = val
    })
    console.log('val===>', val)
  }
)
</script>

<template>
  <TagsView
    v-if="layout === 'cutMenu'"
    :class="[
      '!w-[calc(100%)] border-bottom-1 border-top-1 border-solid border-[var(--tags-view-border-color)] dark:border-[var(--el-border-color)]'
    ]"
    :style="{ transition: 'width var(--transition-time-02), left var(--transition-time-02)' }"
  />
  <section
    :class="[
      ' p-[var(--app-content-padding)] w-[100%] bg-[var(--app-contnet-bg-color)] dark:bg-[var(--el-bg-color)] wg-section',
      {
        '!h-[calc(100%-var(--app-footer-height))]':
          fixedHeader && (layout === 'classic' || layout === 'topLeft') && footer,

        '!h-[calc(100%-var(--tags-view-height)-var(--top-tool-height)-var(--app-footer-height))]':
          ((!fixedHeader && layout === 'classic') || layout === 'top') && footer,

        '!h-[calc(100%-var(--tags-view-height)-var(--app-footer-height))]':
          !fixedHeader && layout === 'topLeft' && footer,

        '!h-[calc(100%-var(--top-tool-height))]': fixedHeader && layout === 'cutMenu' && footer,

        '!h-[calc(100%-var(--top-tool-height)-var(--tags-view-height))]':
          (!fixedHeader && layout === 'cutMenu' && footer) || (layout === 'top' && !footer),
        '!h-[calc(100%-var(--tags-view-height))]': layout === 'cutMenu' && !footer,
        '!h-[100%]': layout !== 'top' && !footer
      }
    ]"
  >
    <router-view>
      <template #default="{ Component, route }">
        <keep-alive :include="getCaches">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
      </template>
    </router-view>
  </section>
  <Footer v-if="footer" />
  <EditUserInfo v-if="state.isShow" v-hasPermi="['system:tenant:update-system']" />
</template>

<style lang="scss" scoped>
.wg-section {
  overflow: auto;
  > :deep(.#{$elNamespace}-card) {
    margin-bottom: 12px !important;
    border: none;
  }
}
</style>
