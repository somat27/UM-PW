<template>
    <main class="login-page d-flex align-items-center justify-content-center min-vh-100">
      <div class="card shadow-sm p-4 w-100" style="max-width: 420px;">
        <h2 class="text-center mb-4 text-primary">Iniciar Sessão</h2>
        <form @submit.prevent="handleEmailLogin" novalidate>
          <div class="mb-3">
            <input
              v-model.trim="email"
              type="email"
              class="form-control form-control-lg"
              placeholder="Email"
              required
            />
          </div>
          <div class="mb-2">
            <input
              v-model="password"
              type="password"
              class="form-control form-control-lg"
              placeholder="Palavra‑passe"
              required
            />
          </div>
          <p v-if="errorMsg" class="text-danger small mb-3">{{ errorMsg }}</p>
          <button class="btn btn-primary w-100 btn-lg" :disabled="!canSubmit" type="submit">
            Entrar
          </button>
        </form>
  
        <div class="d-flex align-items-center my-3">
          <hr class="flex-grow-1" />
          <span class="px-2 small text-muted">ou</span>
          <hr class="flex-grow-1" />
        </div>
  
        <button
          class="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"
          @click="handleGoogleLogin"
        >
          <img src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" alt="Google" style="width:18px;height:18px" />
          Entrar com Google
        </button>
  
        <p class="text-center mt-4 small">
          Não tens conta?
          <router-link to="/register">Registar</router-link>
        </p>
      </div>
    </main>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { loginWithEmail, loginWithGoogle } from '@/firebase';
  
  const email     = ref('');
  const password  = ref('');
  const errorMsg  = ref('');
  const router    = useRouter();
  
  const canSubmit = computed(() => email.value && password.value.length);
  
  const handleEmailLogin = async () => {
    if (!canSubmit.value) {
      errorMsg.value = 'Preenche e‑mail e palavra‑passe.';
      return;
    }
    try {
      await loginWithEmail(email.value, password.value);
      router.push('/dashboards/auditorias');
    } catch (err) {
      switch (err.code) {
        case 'auth/missing-password':
          errorMsg.value = 'Introduz a palavra‑passe.';
          break;
        case 'auth/invalid-email':
          errorMsg.value = 'E‑mail inválido.';
          break;
        case 'auth/wrong-password':
          errorMsg.value = 'Palavra‑passe incorrecta.';
          break;
        case 'auth/user-not-found':
          errorMsg.value = 'Utilizador não encontrado.';
          break;
        default:
          errorMsg.value = 'Erro: ' + err.message;
      }
    }
  };
  
  const handleGoogleLogin = async () => {
    await loginWithGoogle();
    router.push('/dashboards/auditorias');
  };
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
  .btn-outline-secondary {
    border-color: #227ce7;
    color: #227ce7;
  }
  .btn-outline-secondary:hover {
    background-color: #227ce7;
    color: #fff;
  }
  </style>
  