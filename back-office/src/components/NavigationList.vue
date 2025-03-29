<template>
  <nav class="navigation-list">
    <a href="#" class="nav-item nav-item-active">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/bd9d82f1effb8381bb1929299adeb4fb409cd704?placeholderIfAbsent=true&apiKey=98100b9ac2c544efa71903dc3e1eda07"
        alt="Dashboard"
        class="nav-icon"
      />
      <span class="nav-text">Dashboard</span>
    </a>

    <h2 class="nav-section-title">Pages</h2>

    <a href="#" class="nav-item">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/b414ddc8a44a7865af46891e60f33ca4a0160885?placeholderIfAbsent=true&apiKey=98100b9ac2c544efa71903dc3e1eda07"
        alt="Auditorias"
        class="nav-icon"
      />
      <span class="nav-text">Gestão de Auditorias</span>
    </a>

    <a href="#" class="nav-item">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/32555fc51897e2a6d661a8bff00a21a07bb15d13?placeholderIfAbsent=true&apiKey=98100b9ac2c544efa71903dc3e1eda07"
        alt="Notification"
        class="nav-icon"
      />
      <span class="nav-text">Gestão de Ocorrências</span>
    </a>

    <a href="#" class="nav-item">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/08fd61f8d2974d973bc8956784b3929b25f9988a?placeholderIfAbsent=true&apiKey=98100b9ac2c544efa71903dc3e1eda07"
        alt="Alert"
        class="nav-icon"
      />
      <span class="nav-text">Gestão de Peritos</span>
    </a>

    <a href="#" class="nav-item">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/890255b1fe5b0074d3223ecb23bf8221887fb032?placeholderIfAbsent=true&apiKey=98100b9ac2c544efa71903dc3e1eda07"
        alt="Materiais"
        class="nav-icon"
      />
      <span class="nav-text">Gestão de Materiais</span>
    </a>

    <a href="#" class="nav-item">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/2130c19d7d5c87c243ec6c2559e349da836493a5?placeholderIfAbsent=true&apiKey=98100b9ac2c544efa71903dc3e1eda07"
        alt="Profissionais"
        class="nav-icon"
      />
      <span class="nav-text">Gestão de Profissionais</span>
    </a>

    <h2 class="nav-section-title">Perfil</h2>

    <div class="user-profile">
      <img 
    :src="userPhoto" 
    :alt="userName" 
    class="user-avatar"
  />
  <span class="user-name">{{ userName }}</span>
    </div>
  </nav>
</template>

<script>
import { onMounted, ref } from 'vue';
export default {
  name: 'NavigationList',
  setup() {


    const userName = ref('');
    const userPhoto = ref('');

    onMounted(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        userName.value = user.displayName || user.email;
        userPhoto.value = user.photoURL || 'default-avatar.png';
      }
    });
    return {
      userName,
      userPhoto,
    }
  }
}
</script>

<style scoped>
.navigation-list {
  width: 100%;
  font-family: 'Public Sans', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 14px;
  color: #141414;
}

.nav-item {
  position: relative;
  display: flex;
  width: 100%;
  padding: 10px 24px 13px;
  align-items: center;
  gap: 18px;
  color: inherit;
  text-decoration: none;
}

.nav-item-active {
  color: #1890ff;
  font-weight: 500;
  position: relative;
}

.nav-item-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #1890ff;
}

.nav-icon {
  width: 18px;
  aspect-ratio: 0.9;
  object-fit: contain;
}

.nav-text {
  line-height: 21px;
}

.nav-section-title {
  padding: 24px 24px 12px;
  font-size: 12px;
  color: #495057;
  font-weight: 500;
  text-transform: capitalize;
  line-height: 2;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 10px 24px;
  color: #000;
  font-weight: 500;
}

.user-avatar {
  width: 24px;
  aspect-ratio: 1;
  object-fit: contain;
  border-radius: 12px;
}

.user-name {
  line-height: 21px;
}

@media (max-width: 991px) {
  .navigation-list {
    margin-bottom: 10px;
  }

  .nav-item,
  .nav-section-title {
    padding-left: 20px;
    padding-right: 20px;
    white-space: normal;
  }
}
</style>