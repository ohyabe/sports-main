<template>
  <h1>單淘汰產生器</h1>
  <div class="container">
    <div v-html="htmlContent"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      htmlContent: ''
    };
  },
  mounted() {
    fetch('src/DoubleElimination/index.html')
      .then(response => response.text())
      .then(data => {
        this.htmlContent = data;
        this.$nextTick(() => {
          this.loadScripts();
        });
      });
  },
  methods: {
    loadScripts() {
      // 動態加載外部 JS 文件
      const scripts = [
        'src/DoubleElimination/main.js',
        'src/DoubleElimination/pos_map.js'
      ];
      scripts.forEach(src => {
        const script = document.createElement('script');
        script.src = src;
        script.type = 'text/javascript';
        document.body.appendChild(script);
      });
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  padding: 5%;
  width: 70%;
  height: 100%;
  margin: 0 auto;
  text-align: center;
}

h1{
  text-align: center;
  margin-top:50px;
}
</style>
