<template>
    <article class="statistics-card">
      <h3 class="card-title">{{ title }}</h3>
      <p class="card-value">{{ value }}</p>
    </article>
  </template>
  
  <script>
  export default {
    name: "StatisticsCard",
    props: {
      title: {
        type: String,
        required: true,
      },
      value: {
        type: String,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .statistics-card {
    border-radius: 4px;
    border: 1px solid var(--color-grey-92, #e6ebf1);
    background-color: #fff;
    min-height: 103px;
    padding: 26px 12px 9px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family:
      Public Sans,
      -apple-system,
      Roboto,
      Helvetica,
      sans-serif;
  }
  
  .card-title {
    color: #212529;
    font-size: 14px;
    font-weight: 400;
    line-height: 17px;
    text-align: center;
  }
  
  .card-value {
    margin-top: 8px;
    font-size: 20px;
    color: #343a40;
    font-weight: 600;
    line-height: 1.2;
    text-align: center;
  }
  
  @media (max-width: 991px) {
    .statistics-card {
      margin-top: 40px;
    }
  }
  </style>
  