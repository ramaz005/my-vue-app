<!-- src/components/CreatePostForm.vue -->
<script setup>
import { ref } from 'vue'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useCurrentUser } from 'vuefire'

const user = useCurrentUser()
const title = ref('')
const content = ref('')
const isSubmitting = ref(false)
const error = ref('')

const handleSubmit = async () => {
  if (!title.value.trim() || !content.value.trim()) {
    error.value = 'Заполните все поля'
    return
  }
  
  isSubmitting.value = true
  error.value = ''
  
  try {
    await addDoc(collection(db, 'posts'), {
      title: title.value,
      content: content.value,
      authorId: user.value?.uid,
      authorEmail: user.value?.email,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    
    title.value = ''
    content.value = ''
  } catch (err) {
    console.error('Ошибка при создании поста:', err)
    error.value = 'Не удалось создать пост. Попробуйте позже.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6 mb-8">
    <h2 class="text-2xl font-bold text-gray-900 mb-4">Создать новую запись</h2>
    
    <div v-if="error" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
      {{ error }}
    </div>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
          Заголовок
        </label>
        <input
          id="title"
          v-model="title"
          type="text"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      
      <div>
        <label for="content" class="block text-sm font-medium text-gray-700 mb-1">
          Содержание
        </label>
        <textarea
          id="content"
          v-model="content"
          rows="4"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        ></textarea>
      </div>
      
      <div class="flex justify-end">
        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isSubmitting ? 'Публикация...' : 'Опубликовать' }}
        </button>
      </div>
    </form>
  </div>
</template>