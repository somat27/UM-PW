<template>
  <main class="login-page d-flex align-items-center justify-content-center min-vh-100">
    <div class="card shadow-sm p-4 w-100" style="max-width: 420px;">
      <h2 class="text-center mb-4 text-primary">Iniciar Sessão</h2>

      <form @submit.prevent="handleEmailLogin" novalidate>
        <div class="mb-3">
          <input v-model.trim="email" type="email" class="form-control form-control-lg" placeholder="Email" required />
        </div>
        <div class="mb-2">
          <input v-model="password" type="password" class="form-control form-control-lg" placeholder="Palavra‑passe"
            required />
        </div>
        <p v-if="errorMsg" class="text-danger small mb-3">{{ errorMsg }}</p>
        <button class="btn btn-primary w-100 btn-lg mb-3" :disabled="!canSubmit || emailLoading" type="submit">
          {{ emailLoading ? 'A aguardar...' : 'Entrar' }}
        </button>
      </form>
      <hr />

      <button class="btn btn-outline-secondary w-100 btn-lg" @click="handleGoogleLogin" :disabled="googleLoading">
        <span v-if="googleLoading">Abrindo Google...</span>
        <span v-else>Entrar com Google</span>
      </button>

      <p class="text-center mt-3">
        Não tem conta?
        <router-link to="/register">Registar</router-link>
      </p>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { loginWithEmail, auth } from '@/firebase'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

// Estados
const email = ref('')
const password = ref('')
const errorMsg = ref('')
const emailLoading = ref(false)
const googleLoading = ref(false)
const router = useRouter()

// Redireciona se já existir sessão guardada
onMounted(() => {
  const savedUID = localStorage.getItem('userUID')
  if (savedUID) {
    router.replace('/dashboards/auditorias')
  }
})

// Validação do formulário de email
const canSubmit = computed(() => email.value && password.value.length)

// Login por email
const handleEmailLogin = async () => {
  if (emailLoading.value) return
  emailLoading.value = true
  errorMsg.value = ''
  if (!canSubmit.value) {
    errorMsg.value = 'Preenche e‑mail e palavra‑passe.'
    emailLoading.value = false
    return
  }
  try {
    await loginWithEmail(email.value, password.value)
    localStorage.setItem('userUID', auth.currentUser.uid)
    router.push('/dashboards/auditorias')
  } catch (err) {
    switch (err.code) {
      case 'auth/missing-password':
        errorMsg.value = 'Introduz a palavra‑passe.'
        break
      case 'auth/invalid-email':
        errorMsg.value = 'E‑mail inválido.'
        break
      case 'auth/wrong-password':
        errorMsg.value = 'Palavra‑passe incorrecta.'
        break
      case 'auth/user-not-found':
        errorMsg.value = 'Utilizador não encontrado.'
        break
      default:
        errorMsg.value = 'Erro: ' + err.message
    }
  } finally {
    emailLoading.value = false
  }
}

const handleGoogleLogin = async () => {
  if (googleLoading.value) return
  googleLoading.value = true
  errorMsg.value = ''
  try {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    localStorage.setItem('userUID', result.user.uid)
    router.push('/dashboards/auditorias')
  } catch (err) {
    const ignoreCodes = [
      'auth/cancelled-popup-request',
      'auth/popup-closed-by-user',
      'auth/popup-blocked'
    ]
    if (ignoreCodes.includes(err.code)) {
      console.warn('Google login interrompido:', err.code)
    } else {
      errorMsg.value = 'Erro: ' + err.message
    }
  } finally {
    googleLoading.value = false
  }
}
</script>

<style scoped>
.login-page {
  background: linear-gradient(135deg, #e6f1ff 0%, #cde4ff 100%);
}

.card {
  border: none;
  border-radius: 1rem;
}

.btn-primary {
  background-color: #227ce7;
  border-color: #227ce7;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-outline-secondary {
  border-color: #227ce7;
  color: #227ce7;
}

.btn-outline-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-outline-secondary:hover {
  background-color: #227ce7;
  color: #fff;
}
</style>
