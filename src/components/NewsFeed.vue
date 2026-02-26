<script setup>
import { useCurrentUser, useCollection } from 'vuefire'
import { collection, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase'
import PostCard from './PostCard.vue'
import CreatePostForm from './CreatePostForm.vue'

const user = useCurrentUser()

// Загружаем посты из Firestore, сортируем по дате (новые сверху), ограничиваем 20
const posts = useCollection(
  query(
    collection(db, 'posts'),
    orderBy('createdAt', 'desc'),
    limit(20)
  )
)
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Заголовок -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">
        Добро пожаловать, {{ user?.email }}!
      </h1>
      <p class="mt-2 text-gray-600">Лента новостей</p>
    </div>

    <!-- Форма создания поста (будет шаг 15) -->
    <CreatePostForm />

    <!-- Сетка новостей с использованием flex-basis -->
    <div class="flex flex-wrap gap-6 mt-8">
      <!-- Здесь будут карточки постов -->
      <div 
        v-for="post in posts" 
        :key="post.id"
        class="basis-full sm:basis-[calc(50%-12px)] lg:basis-[calc(33.333%-16px)]"
      >
        <PostCard :post="post" />
      </div>
      
      <!-- Сообщение, если постов нет -->
      <div v-if="posts.length === 0" class="basis-full text-center py-12 text-gray-500">
        Пока нет новостей. Создайте первую запись!
      </div>
    </div>
  </div>
</template> 