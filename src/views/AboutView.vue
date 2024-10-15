<template>
  <div class="content">
    <div v-if="!selectedAlbum">
      <h1>活動花絮</h1>
      <div class="albums">
        <div v-for="(album, index) in albums" :key="index" class="album">
          <a @click="viewAlbum(album.name)" style="cursor: pointer;">
            <div v-if="album.photos.length > 0">
              <img :src="album.photos[0].url" alt="相簿封面" width="100" height="100" @error="handleImgError(album)">
            </div>
            <h2>{{ album.name }}</h2>
            <p>上傳者: {{ album.uploaderName }} ({{ album.uploaderRole }})</p>
          </a>
        </div>
      </div>
    </div>
    <div v-else>
      <button @click="selectedAlbum = ''" style="cursor: pointer;border: none;background-color: hsl(197, 54%, 65%);border-radius: 4px;font-weight: bolder;margin-bottom: 1.5%;padding: 5px;">返回</button>

      <h1>{{ selectedAlbum }}</h1>
      <div class="photos">
        <div v-for="(photo, index) in photos" :key="index" class="photo">
          <a :href="photo.url" target="_blank">
            <img :src="photo.url" :alt="photo.title">
          </a>
          <p>{{ photo.title }}</p>
          <p>上傳者: {{ photo.uploaderName }} ({{ photo.uploaderRole }})</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      albums: [],
      photos: [],
      selectedAlbum: '',
      currentUserName: this.$store.state.userName, // 當前用戶名稱
    };
  },
  created() {
    this.fetchAlbums();
  },
  methods: {
    fetchAlbums() {
      fetch("http://localhost:8080/business/getAlbumsWithPhotos")
        .then(response => response.json())
        .then(data => {
          this.albums = data;
        })
        .catch(error => {
          console.error('Error:', error);
        });
    },
    viewAlbum(albumName) {
      this.selectedAlbum = albumName;
      fetch(`http://localhost:8080/business/getPhotos?albumName=${encodeURIComponent(albumName)}`)
        .then(response => response.json())
        .then(data => {
          this.photos = data;
        })
        .catch(error => {
          console.error('Error:', error);
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

.content {
  /* height: 100dvh; */
  padding: 3% 3.5%;
  /* background-color: #f0f0f0; */


}
h1{
  font-weight: bolder;
  text-align: center;
}
.albums {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.albums .album {
  background: #f0f0f0;
  padding: 10px;
  /* border-radius: 8px; */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  text-align: center;
}


/* .albums .album:hover {
  transform: scale(1.05);
} */

h2{
  font-weight: bolder;
}
.photos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.photo {
  background: #f9f9f9;
  padding: 10px;
  /* border-radius: 8px; */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

/* .photo:hover {
  transform: scale(1.05);
} */
.albums .album img {
  max-width: 100%;

  filter: grayscale(100%);
  -webkit-filter: grayscale(100%);
  -webkit-transition: all 1s ease;
      &:hover{
          filter: grayscale(0%);
          filter: gray;
          -webkit-filter: grayscale(0%);
          filter: none;
          transition: 1s ease;
      }
}
.photo img {
  width: 100%;
  height: 90%;
  /* border-radius: 4px; */
  filter: grayscale(100%);
-webkit-filter: grayscale(100%);
-webkit-transition: all 1s ease;
      &:hover{
          filter: grayscale(0%);
          filter: gray;
          -webkit-filter: grayscale(0%);
          filter: none;
          transition: 1s ease;
      }
}


.photo p {
  margin-top: 10px;
  font-size: 16px;
  color: #555;
}
</style>
