// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore' // Раскомментируй, если будешь использовать базу данных

// Вставь сюда свою конфигурацию из консоли Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAbQhY1HdUXRi1_UqUqH7xZS1-RCACbH7c",
  authDomain: "my-vue-auth-project-1a5b8.firebaseapp.com",
  projectId: "my-vue-auth-project-1a5b8",
  storageBucket: "my-vue-auth-project-1a5b8.firebasestorage.app",
  messagingSenderId: "905367218420",
  appId: "1:905367218420:web:b5a2d4f9ea35076a4296a1"
};

// Инициализируем Firebase
const firebaseApp = initializeApp(firebaseConfig)

// Создаём экземпляры сервисов, которые будем использовать
export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp) // Раскомментируй для базы данных

export default firebaseApp