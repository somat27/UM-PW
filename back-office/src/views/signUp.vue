<template>
  <main class="signUp">
    <section class="signup-content">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/17649d8b23b25a41eb05d1c62ea11c4f63101c4f?placeholderIfAbsent=true&apiKey=98100b9ac2c544efa71903dc3e1eda07"
        alt="Logo"
        class="logo-image"
      />
      <button 
        class="google-login-button"
        @click="handleGoogleLogin"
      >
      <img 
          src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" 
          alt="Google Logo" 
          class="google-icon"
        />
        Log In with Google
      </button>
      <p class="terms-text">
        By Signing up to EyesEverywhere, means you agree to our Privacy Policy
        and Terms of Service
      </p>
    </section>
  </main>
</template>

<script>
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

export default {
  name: "signUp",
  setup() {
    const router = useRouter();
    const user = ref(null);

    const handleGoogleLogin = async () => {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        
        user.value = result.user;
        
       
        localStorage.setItem('user', JSON.stringify({
          displayName: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL
        }));

        
        router.push({ name: 'auditorias' });
      } catch (error) {
        console.error("Google Sign-In Error", error);
        
        alert('Failed to log in with Google');
      }
    };

    return {
      handleGoogleLogin
    };
  }
};
</script>
  
  <style scoped>

  .signUp{
    background-color: rgba(32, 76, 109, 1);
  
    display: flex;
    padding: 197px 80px 405px;
    flex-direction: column;
    overflow: hidden;
    align-items: center;
    font-family:
      Zen Kaku Gothic Antique,
      -apple-system,
      Roboto,
      Helvetica,
      sans-serif;
    font-weight: 400;
  }

.signup-content {
  display: flex;
  width: 448px;
  max-width: 100%;
  flex-direction: column;
  align-items: center;
}

.logo-image {
  aspect-ratio: 6.21;
  object-fit: contain;
  object-position: center;
  width: 100%;
  align-self: stretch;
}

.google-login-button {
  border-radius: 48px;
  background-color: rgba(227, 243, 251, 1);
  margin-top: 125px;
  width: 100%;
  font-size: 16px;
  color: rgba(66, 66, 66, 1);
  line-height: 1.6;
  border: none;
  cursor: pointer;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 14px 45px;
}

.google-icon {
  width: 20px;
  height: 20px;
}

.terms-text {
  color: rgba(255, 255, 255, 1);
  font-size: 10px;
  text-decoration: underline;
  margin-top: 35px;
  text-align: center;
}

@media (max-width: 991px) {
  .signUp {
    padding: 100px 20px;
  }
  
  .google-login-button {
    padding: 14px 20px;
    margin-top: 40px;
    gap: 8px;
  }
  
  .google-icon {
    width: 18px;
    height: 18px;
  }
  
  .logo-image {
    max-width: 100%;
  }
}
  </style>
  