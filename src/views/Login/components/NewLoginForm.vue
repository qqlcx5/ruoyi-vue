<template>
  <el-form
    :model="loginData.loginForm"
    :rules="LoginRules"
    label-position="top"
    class="login-form w-full"
    label-width="120px"
    size="large"
    ref="formLogin"
  >
    <el-row class="flex flex-col justify-center px-56px">
      <div class="mt-70px">
        <img src="@/assets/imgs/company.png" alt="" class="m-auto" />
      </div>
      <div class="flex justify-between items-center mb-22px mt-70px">
        <div class="text-20px font-bold form-title">{{ LoginFormTitle }}</div>
        <div class="qrcode-box flex items-center">
          <div
            v-show="getShow"
            class="qrcode-tip relative flex items-center h-30px text-12px px-8px rounded-2px"
          >
            <i class="iconfont icon-anquan mr-4px !text-14px"></i>
            扫码登录更安全
          </div>
          <img
            :src="getShow ? qrCodeImage : formImage"
            alt="qrcode"
            class="w-50px inline-block cursor-pointer"
            @click="
              setLoginState(
                getLoginState === LoginStateEnum.QR_CODE
                  ? LoginStateEnum.LOGIN
                  : LoginStateEnum.QR_CODE
              )
            "
          />
        </div>
      </div>
      <div v-show="getShow">
        <el-col :span="24">
          <el-form-item prop="username">
            <el-input
              v-model="loginData.loginForm.username"
              :placeholder="t('login.usernamePlaceholder')"
            >
              <template #prefix>
                <i class="iconfont icon-zhanghu !text-18px"></i>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="password">
            <el-input
              v-model="loginData.loginForm.password"
              type="password"
              :placeholder="t('login.passwordPlaceholder')"
              show-password
              @keyup.enter="getCode()"
            >
              <template #prefix>
                <i class="iconfont icon-mima !text-18px"></i>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="tenantName">
            <el-input
              type="text"
              v-model="loginData.loginForm.tenantName"
              :placeholder="t('login.tenantNamePlaceholder')"
            >
              <template #prefix>
                <i class="iconfont icon-gongsi !text-18px"></i>
              </template>
            </el-input>
            <!--            <el-select v-model="loginData.loginForm.tenantName" placeholder="请选择" class="w-full">-->
            <!--              <template #prefix>-->
            <!--                <i class="iconfont icon-gongsi !text-18px"></i>-->
            <!--              </template>-->
            <!--              <el-option-->
            <!--                :label="loginData.loginForm.tenantName"-->
            <!--                :value="loginData.loginForm.tenantName"-->
            <!--              />-->
            <!--            </el-select>-->
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item>
            <el-row justify="space-between">
              <el-col :span="6">
                <el-checkbox v-model="loginData.loginForm.rememberMe">
                  {{ t('login.remember') }}
                </el-checkbox>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="text-center">
          <el-form-item>
            <XButton
              :loading="loginLoading"
              type="primary"
              class="w-[100%]"
              :title="t('login.login')"
              @click="getCode()"
            />
          </el-form-item>
          <el-link type="primary">{{ t('login.forgetPassword') }}</el-link>
        </el-col>
      </div>
      <div>
        <!-- 二维码登录 -->
        <NewQrCodeForm />
      </div>
      <Verify
        ref="verify"
        mode="pop"
        :captchaType="captchaType"
        :imgSize="{ width: '400px', height: '200px' }"
        @success="handleLogin"
      />
    </el-row>
  </el-form>
</template>
<script setup lang="ts">
import { ElLoading } from 'element-plus'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { NewQrCodeForm } from './index'

import * as authUtil from '@/utils/auth'
import { usePermissionStore } from '@/store/modules/permission'
import * as LoginApi from '@/api/login'
import { LoginStateEnum, LoginStateMap, useLoginState, useFormValid } from './useLogin'

import qrCodeImage from '@/assets/imgs/login-qrcode.png'
import formImage from '@/assets/imgs/login-form.png'

const { t } = useI18n()
const formLogin = ref()
const { validForm } = useFormValid(formLogin)
const { setLoginState, getLoginState } = useLoginState()
const { currentRoute, push } = useRouter()
const permissionStore = usePermissionStore()
const redirect = ref<string>('')
const loginLoading = ref(false)
const verify = ref()
const captchaType = ref('blockPuzzle') // blockPuzzle 滑块 clickWord 点击文字

const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN)
const LoginFormTitle = computed(() => LoginStateMap[unref(getLoginState)])

const LoginRules = {
  tenantName: [required],
  username: [required],
  password: [required]
}
const loginData = reactive({
  isShowPassword: false,
  captchaEnable: import.meta.env.VITE_APP_CAPTCHA_ENABLE,
  tenantEnable: import.meta.env.VITE_APP_TENANT_ENABLE,
  loginForm: {
    tenantName: '万车利源码',
    username: 'admin',
    password: 'admin123',
    captchaVerification: '',
    rememberMe: false
  }
})

// const socialList = [
//   { icon: 'ant-design:github-filled', type: 0 },
//   { icon: 'ant-design:wechat-filled', type: 30 },
//   { icon: 'ant-design:alipay-circle-filled', type: 0 },
//   { icon: 'ant-design:dingtalk-circle-filled', type: 20 }
// ]

// 获取验证码
const getCode = async () => {
  // 情况一，未开启：则直接登录
  if (loginData.captchaEnable === 'false') {
    await handleLogin({})
  } else {
    // 情况二，已开启：则展示验证码；只有完成验证码的情况，才进行登录
    // 弹出验证码
    verify.value.show()
  }
}
//获取租户ID
const getTenantId = async () => {
  if (loginData.tenantEnable === 'true') {
    const res = await LoginApi.getTenantIdByNameApi(loginData.loginForm.tenantName)
    authUtil.setTenantId(res)
  }
}
// 记住我
const getCookie = () => {
  const loginForm = authUtil.getLoginForm()
  if (loginForm) {
    loginData.loginForm = {
      ...loginData.loginForm,
      username: loginForm.username ? loginForm.username : loginData.loginForm.username,
      password: loginForm.password ? loginForm.password : loginData.loginForm.password,
      rememberMe: loginForm.rememberMe ? true : false,
      tenantName: loginForm.tenantName ? loginForm.tenantName : loginData.loginForm.tenantName
    }
  }
}
// 登录
const handleLogin = async (params) => {
  loginLoading.value = true
  try {
    await getTenantId()
    const data = await validForm()
    if (!data) {
      return
    }
    loginData.loginForm.captchaVerification = params.captchaVerification
    const res = await LoginApi.loginApi(loginData.loginForm)
    if (!res) {
      return
    }
    ElLoading.service({
      lock: true,
      text: '正在加载系统中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    if (loginData.loginForm.rememberMe) {
      authUtil.setLoginForm(loginData.loginForm)
    } else {
      authUtil.removeLoginForm()
    }
    authUtil.setToken(res)
    if (!redirect.value) {
      redirect.value = '/'
    }
    push({ path: redirect.value || permissionStore.addRouters[0].path })
  } catch {
    loginLoading.value = false
  } finally {
    setTimeout(() => {
      const loadingInstance = ElLoading.service()
      loadingInstance.close()
    }, 400)
  }
}

// 社交登录
// const doSocialLogin = async (type: number) => {
//   if (type === 0) {
//     message.error('此方式未配置')
//   } else {
//     loginLoading.value = true
//     if (loginData.tenantEnable === 'true') {
//       await message.prompt('请输入租户名称', t('common.reminder')).then(async ({ value }) => {
//         const res = await LoginApi.getTenantIdByNameApi(value)
//         authUtil.setTenantId(res)
//       })
//     }
//     // 计算 redirectUri
//     const redirectUri =
//       location.origin + '/social-login?type=' + type + '&redirect=' + (redirect.value || '/')
//     // 进行跳转
//     const res = await LoginApi.socialAuthRedirectApi(type, encodeURIComponent(redirectUri))
//     window.location.href = res
//   }
// }
watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)
onMounted(() => {
  getCookie()
})
</script>

<style lang="scss" scoped>
.form-title,
.qrcode-box i {
  color: var(--el-color-primary);
}
.qrcode-box {
  div {
    color: var(--el-color-primary);
    background-color: #e8f2ff;
  }
  .qrcode-tip::after {
    content: '';
    position: absolute;
    right: -4px;
    top: 50%;
    width: 10px;
    height: 10px;
    background-color: #e8f2ff;
    transform: translateY(-50%) rotate(45deg);
  }
}
:deep(.anticon) {
  &:hover {
    color: var(--el-color-primary) !important;
  }
}
.login-code {
  width: 100%;
  height: 38px;
  float: right;

  img {
    cursor: pointer;
    width: 100%;
    max-width: 100px;
    height: auto;
    vertical-align: middle;
  }
}
</style>