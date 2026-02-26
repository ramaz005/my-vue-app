<!-- src/components/AuthForm.vue -->
<script setup>
import { ref } from 'vue'
import { useFirebaseAuth } from 'vuefire'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { useCurrentUser } from 'vuefire'

// Получаем текущего пользователя (реактивно!)
const user = useCurrentUser()
// Получаем экземпляр аутентификации
const auth = useFirebaseAuth()

// Состояние формы
const isLogin = ref(true)
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('') // Для показа ошибок

// Обработчик отправки
const handleSubmit = async () => {
  errorMessage.value = '' // Сбрасываем ошибку
  try {
    if (isLogin.value) {
      // ВХОД
      await signInWithEmailAndPassword(auth, email.value, password.value)
      console.log('Успешный вход!')
    } else {
      // РЕГИСТРАЦИЯ
      if (password.value !== confirmPassword.value) {
        errorMessage.value = 'Пароли не совпадают'
        return
      }
      await createUserWithEmailAndPassword(auth, email.value, password.value)
      console.log('Успешная регистрация!')
    }
  } catch (error) {
    // Обрабатываем ошибки Firebase (показываем понятное сообщение)
    console.error('Ошибка аутентификации:', error)
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage.value = 'Неверный формат email'
        break
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        errorMessage.value = 'Неверный email или пароль'
        break
      case 'auth/email-already-in-use':
        errorMessage.value = 'Этот email уже зарегистрирован'
        break
      case 'auth/weak-password':
        errorMessage.value = 'Пароль должен быть минимум 6 символов'
        break
      default:
        errorMessage.value = 'Ошибка при входе. Попробуйте снова.'
    }
  }
}

// Выход из аккаунта
const handleLogout = async () => {
  await signOut(auth)
}

// Переключение режима
const toggleMode = () => {
  isLogin.value = !isLogin.value
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
  errorMessage.value = ''
}
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <!-- Заголовок -->
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        {{ user ? 'Добро пожаловать!' : (isLogin ? 'Вход в аккаунт' : 'Регистрация') }}
      </h2>
    </div>

    <!-- Если пользователь авторизован -->
    <div v-if="user" class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm text-center">
      <p class="text-gray-700 mb-4">Вы вошли как: <strong>{{ user.email }}</strong></p>
      <button
        @click="handleLogout"
        class="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500"
      >
        Выйти
      </button>
    </div>

    <!-- Форма входа/регистрации (если не авторизован) -->
    <div v-else class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <!-- Сообщение об ошибке -->
      <div v-if="errorMessage" class="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
        {{ errorMessage }}
      </div>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
          <div class="mt-2">
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <!-- Пароль -->
        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Пароль</label>
          </div>
          <div class="mt-2">
            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <!-- Подтверждение пароля (только для регистрации) -->
        <div v-if="!isLogin">
          <label for="confirm-password" class="block text-sm font-medium leading-6 text-gray-900">Подтвердите пароль</label>
          <div class="mt-2">
            <input
              id="confirm-password"
              v-model="confirmPassword"
              type="password"
              required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <!-- Кнопка отправки -->
        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {{ isLogin ? 'Войти' : 'Зарегистрироваться' }}
          </button>
        </div>
      </form>

      <!-- Ссылка для переключения режима -->
      <p class="mt-10 text-center text-sm text-gray-500">
        {{ isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?' }}
        <button
          @click="toggleMode"
          class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
        >
          {{ isLogin ? 'Зарегистрируйтесь' : 'Войдите' }}
        </button>
      </p>
    </div>
  </div>
</template>