<template>
  <main class="login-page d-flex align-items-center justify-content-center min-vh-100">
    <div class="card shadow-sm p-4 w-100" style="max-width: 460px;">
      <h2 class="text-center mb-4 text-primary">Criar Conta</h2>
      <form @submit.prevent="handleRegister" novalidate>
        <div class="mb-3">
          <input
            v-model.trim="displayName"
            type="text"
            class="form-control form-control-lg"
            placeholder="Nome"
            required
          />
        </div>
        <div class="mb-3">
          <input
            v-model.trim="email"
            type="email"
            class="form-control form-control-lg"
            placeholder="Email"
            required
          />
        </div>
        <div class="mb-3">
          <input
            v-model="password"
            type="password"
            class="form-control form-control-lg"
            placeholder="Palavra‑passe (min. 6)"
            required
          />
        </div>
        <div class="mb-2">
          <input
            v-model="confirm"
            type="password"
            class="form-control form-control-lg"
            placeholder="Confirmar palavra‑passe"
            required
          />
        </div>
        <p v-if="errorMsg" class="text-danger small mb-3">{{ errorMsg }}</p>
        <button class="btn btn-primary w-100 btn-lg" :disabled="!canSubmit" type="submit">
          Registar
        </button>
      </form>
      <p class="text-center mt-4 small">
        Já tens conta?
        <router-link to="/">Entrar</router-link>
      </p>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { registerWithEmail } from '@/firebase';

const displayName = ref('');
const email       = ref('');
const password    = ref('');
const confirm     = ref('');
const errorMsg    = ref('');
const router      = useRouter();

const canSubmit = computed(() =>
  displayName.value && email.value && password.value.length >= 6 && password.value === confirm.value
);

const handleRegister = async () => {
  if (!canSubmit.value) {
    errorMsg.value = 'Preenche todos os campos correctamente.';
    return;
  }
  try {
    await registerWithEmail(email.value, password.value, displayName.value);
    router.push('/');
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      errorMsg.value = 'Esse e‑mail já está registado.';
    } else if (err.code === 'auth/weak-password') {
      errorMsg.value = 'Palavra‑passe deve ter pelo menos 6 caracteres.';
    } else {
      errorMsg.value = 'Erro: ' + err.message;
    }
  }
};
</script>

<style scoped>
/* Reusa as mesmas cores */
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
</style>