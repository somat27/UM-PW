<template>
    <div class="dashboard-container">
        <div class="dashboard-layout">
            <main class="main-content">
                <div class="content-wrapper centered">
                    <div class="card">
                        <h2>Conta Pendente</h2>
                        <p>
                            A sua conta ainda não foi validada por um Admin.<br />
                            Por favor, aguarde até receber a validação.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script>

export default {
    name: 'PendingValidation'
}
</script>

<style scoped>
.centered {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
}
.card {
  background: #fff;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  text-align: center;
}
.card h2 {
  margin-bottom: 16px;
}
</style>