template>
  <div class="block text-center" m="t-4">
    <el-carousel trigger="click" height="500px">
      <el-carousel-item v-for="(item, index) in items" :key="index">
        <div class="carousel-container">
          <div class="carousel-bg" :style="{ backgroundImage: `url(${item})` }"></div>
          <img :src="item" alt="" class="carousel-image" />
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
      'src/components/運動會/piktochart_64573376.png',
      'src/components/運動會/piktochart_64574403.png',
        'src/components/運動會/piktochart_64574076.png',
        'src/components/運動會/work-anniversar_64574518.png',
        ]
    };
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.demonstration {
  color: var(--el-text-color-secondary);
}

.el-carousel__item {
  text-align: center;
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  filter: blur(20px); /* 模糊效果 */
  z-index: 1;
}

.carousel-image {
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: contain;
  z-index: 2;
  margin: auto;
  display: block;
}
</style>
