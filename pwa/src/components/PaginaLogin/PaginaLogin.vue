<template>

    <div class="fundo">
        <div class="campo-imagem">
            <i class="bi bi-eye"></i>
        </div>

        <div class="nome-empresa">
            <h1>Eyes</h1>
            <h1 id="texto-azul">Everywhere</h1>
        </div>

        <div>
            <h3>Gestão inteligente de auditorias</h3>
        </div>

        <div class="campo-pesquisa">
            <h2>Email</h2>
            <input
                type="email"
                v-model="email"
                placeholder="seu@email.com"
            />
        </div>

        <div class="campo-pesquisa">
            <h2>Senha</h2>
            <div class="campo-senha">
                <input
                    :type="mostrarSenha ? 'text' : 'password'"
                    v-model="password"
                    placeholder="********"
                />
                <i class="bi icon" :class="mostrarSenha ? 'bi-eye-slash' : 'bi-eye'" @click="mostrarSenha = !mostrarSenha"></i>
            </div>
        </div>

        
        <button class="botao-entrar" @click="login">
            <i class="bi bi-box-arrow-in-right"></i>
            <span>Entrar</span>
        </button>


        <div>
            <button @click="signInWithGoogle" class="botao-google"><h3>Sign In With Google</h3></button>
            <h3>Credenciais para teste:</h3>
            <h3>demo@eyeseverywhere.com / demo123</h3>
        </div>
    </div>
</template>


<script>
    import { auth } from "@/firebase/firebase.js";
    import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
    export default {
        name: 'PaginaLogin',
        data() {
            return {
                email: '',
                password: '',
                mostrarSenha: false,
            }; 
        },
        methods: {
            onSearch() {
                
            },
            goToPaginaIncial() {
                this.$router.push("/PaginaInicial");
            },
            signInWithGoogle() {
                const provider = new GoogleAuthProvider();
                signInWithPopup(auth, provider)
                    .then((/*result*/) => {
                        //const user = result.user;
                        //const uid = user.uid;
                        this.$router.push({ name: "PaginaInicial"/*, params: { uid }*/});
                    })
                    .catch((error) => {
                        console.error("Erro ao autenticar com Google:", error);
                    });
            },
            login() {
                signInWithEmailAndPassword(auth, this.email, this.password)
                    .then((userCredential) => {
                    const user = userCredential.user;
                    console.log("Usuário logado:", user.email);
                    this.$router.push("/PaginaInicial");
                    })
                    .catch((error) => {
                    console.error("Erro no login:", error.message);
                    alert("Erro ao fazer login. Verifique seu email e senha.");
                    });
                },
        },
    };
</script>


<style scoped>
    .fundo {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: rgba(197, 196, 196, 0.116);
    }

    .campo-imagem {
        width: 10vh;
        height: 10vh;
        border-radius: 50%;
        background-color: rgba(0, 102, 255, 0.1);
        display: flex;
        justify-content: center;
        align-items: center;

        color: rgba(0, 68, 255, 0.877);
        font-size: 5vh;
        text-align: center;
    }

    .nome-empresa {
        display: flex;
        justify-content: center;
    }

    #texto-azul {
        color: blue;
    }

    h2 {
        font-size: 12px;
    }

    h3 {
        font-size: 14px;
        color: #888;
    }

    .campo-pesquisa {
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: left;
        padding: 1.5vh;
        width: 80vw;
        
        position: relative;
    }

    input {
        border-radius: 15px;
        
        padding: 8px;
        font-size: 16px;
        border: 1px solid #ccc;
        width: 100%;
    }

    .campo-senha {
        display: flex;
    }

    .icon {
        align-self: center;
        position: absolute;
        right: 4.5vh;

        font-size: 18px;
        color: #888;
    }

    .botao-entrar {
        margin-top: 2vh;
        margin-bottom: 2vh;
        display: flex;
        justify-content: center;
        gap: 10px;
        align-items: center;
        border: none;
        background-color: blue;
        color: #fff;
        width: 70vw;
        padding: 1vh;
        border-radius: 15px;
        font-size: 16px;
    }

    .botao-google {
        border: none;
        background-color: transparent;
        margin-bottom: 1vh;
    }
</style>