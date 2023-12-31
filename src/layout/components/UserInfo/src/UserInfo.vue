<script setup lang="ts">
import { ElMessageBox } from 'element-plus'

import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import { useDesign } from '@/hooks/web/useDesign'
import avatarImg from '@/assets/imgs/avatar.gif'
import { useUserStore } from '@/store/modules/user'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { useAppStore } from '@/store/modules/app'
import userImg from '@/assets/imgs/user.png'

const appStore = useAppStore()

const { t } = useI18n()

const { wsCache } = useCache()

const { push, replace } = useRouter()

const userStore = useUserStore()

const tagsViewStore = useTagsViewStore()

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('user-info')

const user = wsCache.get(CACHE_KEY.USER)

const avatar = user.user.avatar ? user.user.avatar : avatarImg

const userName = user.user.nickname ? user.user.nickname : 'Admin'

const loginOut = () => {
  ElMessageBox.confirm(t('common.loginOutMessage'), t('common.reminder'), {
    confirmButtonText: t('common.ok'),
    cancelButtonText: t('common.cancel'),
    type: 'warning'
  })
    .then(async () => {
      await userStore.loginOut()
      tagsViewStore.delAllViews()
      replace('/login?redirect=/index')
    })
    .catch(() => {})
}
const toProfile = async () => {
  push('/user/profile')
}

//打开布局设置
const openSetting = () => {
  appStore.setIShowSetting(!appStore.isShowSetting)
}
</script>

<template>
  <ElDropdown :class="prefixCls" trigger="click">
    <div class="user-content flex items-center">
      <img
        :src="avatar"
        alt=""
        class="w-[calc(var(--logo-height)-28px)] rounded-[50%]"
        @error="
          (e) => {
            e.target.src = userImg
          }
        "
      />
      <span class="<lg:hidden text-14px pl-[5px] text-[var(--top-header-text-color)]">
        {{ userName }}
      </span>

      <Icon
        icon="svg-icon:pull-down"
        class="pull-down"
        :size="16"
        :color="appStore.getIsDark ? 'var(&#45;&#45;el-text-color-regular)' : '#333'"
      />
    </div>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem @click="toProfile">
          <Icon icon="ep:tools" />
          <div>{{ t('common.profile') }}</div>
        </ElDropdownItem>
        <!-- <ElDropdownItem>
          <Icon icon="ep:menu" />
          <div @click="toDocument">{{ t('common.document') }}</div>
        </ElDropdownItem> -->
        <ElDropdownItem @click="openSetting">
          <Icon icon="ep:tools" />
          <div>{{ t('common.layoutSetting') }}</div>
        </ElDropdownItem>
        <ElDropdownItem divided @click="loginOut">
          <Icon icon="ep:switch-button" />
          <div>{{ t('common.loginOut') }}</div>
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

<style lang="scss" scoped>
.user-content {
  display: flex;
  justify-content: center;
  width: 158px;
  height: 100%;
  font-size: $font-size;
  font-family: $font-family;
  cursor: pointer;
}
.pull-down {
  margin-left: 4px;
}
</style>
