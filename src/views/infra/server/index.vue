<template>
  <ContentWrap>
    <IFrame :src="src" />
  </ContentWrap>
</template>
<script setup lang="ts" name="AdminServer">
const BASE_URL = import.meta.env.VITE_BASE_URL
const src = ref(BASE_URL + '/admin/applications')
console.log('JAVA监控src ', src)
</script>
