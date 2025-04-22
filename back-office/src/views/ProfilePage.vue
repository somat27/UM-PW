<template>
    <main class="profile-page container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow-sm p-4">
            <h2 class="mb-4 text-primary">O meu perfil</h2>
  
            <div class="d-flex align-items-center gap-4 mb-4 flex-wrap">
              <img
                :src="previewPhoto || user.photoURL || defaultAvatar"
                class="rounded-circle border"
                style="width:120px;height:120px;object-fit:cover;"
                alt="Avatar"
              />
              <div>
                <label class="btn btn-outline-secondary btn-sm mb-2">
                  Alterar foto
                  <input type="file" class="d-none" accept="image/*" @change="onFileChange" />
                </label>
                <p class="text-muted small mb-0">.jpg ou .png até 2MB</p>
              </div>
            </div>
  
            <form @submit.prevent="save" class="row g-3">
              <div class="col-sm-6">
                <label class="form-label">Nome</label>
                <input v-model.trim="displayName" class="form-control" required />
              </div>
              <div class="col-sm-6">
                <label class="form-label">E‑mail</label>
                <input v-model="email" class="form-control" disabled />
              </div>
              <div class="col-12 text-end">
                <button class="btn btn-primary" :disabled="saving">Guardar alterações</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { updateDoc, doc } from 'firebase/firestore';
  import { db } from '@/firebase';
  import { currentUser, useCurrentUser } from '@/composables/useCurrentUser';
  
  useCurrentUser();
  
  const user         = currentUser;        // reactive
  const displayName  = ref('');
  const email        = ref('');
  const previewPhoto = ref('');
  const newFile      = ref(null);
  const saving       = ref(false);
  const defaultAvatar = 'https://i.pravatar.cc/120?u=default';
  
  watch(user, (u) => {
    if (u) {
      displayName.value = u.displayName || '';
      email.value       = u.email || '';
    }
  }, { immediate: true });
  
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    newFile.value     = file;
    previewPhoto.value = URL.createObjectURL(file);
  };
  
  const save = async () => {
    if (!user.value) return;
    saving.value = true;
    let photoURL = user.value.photoURL;
  
    try {
      if (newFile.value) {
        const storage = getStorage();
        const fileRef = sRef(storage, `avatars/${user.value.uid}`);
        await uploadBytes(fileRef, newFile.value);
        photoURL = await getDownloadURL(fileRef);
      }
      await updateDoc(doc(db, 'users', user.value.uid), {
        displayName: displayName.value,
        photoURL,
      });
    } finally {
      saving.value = false;
    }
  };
  </script>
  
  <style scoped>
  .profile-page { background:#f5f9ff; }
  </style>
  