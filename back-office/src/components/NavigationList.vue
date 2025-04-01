<template>
  <nav class="navigation-list">
    <router-link to="/dashboards/auditorias" 
    class="nav-item" 
    :class="{ 'nav-item-active': isDashboardActive }"
    >

      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/bd9d82f1effb8381bb1929299adeb4fb409cd704?placeholderIfAbsent=true&apiKey=98100b9ac2c544efa71903dc3e1eda07"
        alt="Dashboard"
        class="nav-icon"
      />
      <span class="nav-text">Dashboard</span>
    </router-link>

    <h2 class="nav-section-title">Pages</h2>

    <router-link to="/GestaoAuditorias" 
    class="nav-item"

    >
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/b414ddc8a44a7865af46891e60f33ca4a0160885?placeholderIfAbsent=true&apiKey=98100b9ac2c544efa71903dc3e1eda07"
        alt="Auditorias"
        class="nav-icon"
      />
      <span class="nav-text">Gestão de Auditorias</span>
    </router-link>

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
    <button @click="logOut" class="logout-button">
      <span class="logout-text">LOG OUT ⏻</span>
      <div class="lock-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      </div>
    </button>
  </nav>
</template>

<script>
import { onMounted, ref, computed} from 'vue';
import { useRouter} from 'vue-router'; 
import { useRoute } from "vue-router";

export default {
  name: 'NavigationList',
  setup() {


    const userName = ref('');
    const userPhoto = ref('');
   
    const router = useRouter(); 

   
    const logOut = () => {
      router.push('/'); 
    };
    onMounted(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        userName.value = user.displayName || user.email;
        userPhoto.value = user.photoURL || 'default-avatar.png';
      }
    });
    const route = useRoute();

const isDashboardActive = computed(() => {
  return route.path.startsWith("/dashboards/");
});

    return {
      userName,
      userPhoto,
      logOut,
      isDashboardActive,
    }
  }
}
</script>

<style scoped>
.nav-item.router-link-active {
  background-color: #1890ff;
  color: white;
  font-weight: bold;
}
.nav-item-active {
  background-color: #1890ff;
  color: white;
  font-weight: bold;
}
.nav-item-active .nav-text {
  color: white !important; 
  font-weight: bold;
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
.logout-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #3498db; 
  color: white;
  border: none;
  border-radius: 50px;
  padding: 10px 20px;
  margin: 15px auto;
  width: 49%;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.logout-button:hover {
  background-color: #e74c3c; 
}

.logout-text {
  margin-right: 10px;
  letter-spacing: 1px;
}
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
  filter: grayscale(100%) brightness(0) invert(0); /* Preto e branco */


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
  height: 24px;
  object-fit: cover;
  border-radius: 12px;
  display: block;
  background-color: #f0f0f0; 
}

.user-name {
  line-height: 21px;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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