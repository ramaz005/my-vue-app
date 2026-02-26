<script setup>
import { useCurrentUser } from 'vuefire'
import AuthForm from './components/AuthForm.vue'
import NewsFeed from './components/NewsFeed.vue'

const user = useCurrentUser()
</script>

<template>
  <main>
    <AuthForm v-if="!user" />
    <NewsFeed v-else />
  </main>
</template>