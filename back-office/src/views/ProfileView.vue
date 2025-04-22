<template>
    <div class="dashboard-container">
        <div class="dashboard-layout">
            <aside class="sidebar-column">
                <nav class="sidebar-nav">
                    <div class="sidebar-background">
                        <NavigationList />
                    </div>
                </nav>
            </aside>
            <main class="main-content">
                <div class="content-wrapper">
                    <div class="page-header">
                        <h2>Meu Perfil</h2>
                        <button class="btn btn-primary" @click="goToEdit">
                            Editar Perfil
                        </button>
                    </div>

                    <div class="profile-card">
                        <div class="profile-field">
                            <label>Nome:</label>
                            <span>{{ profile.displayName }}</span>
                        </div>
                        <div class="profile-field">
                            <label>Email:</label>
                            <span>{{ profile.email }}</span>
                        </div>
                        <!-- adicione mais campos aqui -->
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase'
import NavigationList from '@/components/NavigationList.vue'

export default {
    name: 'ProfileView',
    components: {
        NavigationList
    },
    setup() {
        const profile = ref({ displayName: '', email: '' })
        const router = useRouter()

        onMounted(async () => {
            const user = auth.currentUser
            if (!user) return router.push('/')
            const snap = await getDoc(doc(db, 'users', user.uid))
            if (snap.exists()) profile.value = snap.data()
        })

        const goToEdit = () => {
            router.push({ name: 'EditProfile' })
        }

        return { profile, goToEdit }
    }
}
</script>


<style scoped>
.dashboard-layout {
    display: flex;
    gap: 20px;
}

.sidebar-column {
    width: 20%;
}

.main-content {
    flex: 1;
}

.content-wrapper {
    margin-top: 40px;
}

.icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.icon-btn:hover {
    background-color: #f0f0f0;
}

.icon-btn img {
    width: 20px;
    height: 20px;
    object-fit: contain;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.profile-card {
    background: #fff;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.profile-field {
    display: flex;
    margin-bottom: 16px;
}

.profile-field label {
    width: 120px;
    font-weight: 600;
}

.profile-field span {
    flex: 1;
}

.btn-primary {
    background-color: #227ce7;
    color: #fff;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
}

.btn-primary:hover {
    background-color: #1a62b8;
}
</style>