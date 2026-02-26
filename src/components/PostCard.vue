<!-- src/components/PostCard.vue -->
<script setup>
defineProps({
  post: {
    type: Object,
    required: true
  }
})

</script>

<template>
  <article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div class="p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-2">
        {{ post.title }}
      </h2>
      <p class="text-gray-600 mb-4 line-clamp-3">
        {{ post.content }}
      </p>
      <div class="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
        <span>Автор: {{ post.authorEmail }}</span>
        <span>{{ new Date(post.createdAt?.toDate()).toLocaleDateString() }}</span>
      </div>
    </div>
  </article>
</template>