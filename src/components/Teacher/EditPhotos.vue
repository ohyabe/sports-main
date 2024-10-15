<template>
  <div class="content">
    <div v-if="!selectedAlbum">
      <h1>編輯相簿</h1>
      <div class="albums">
        <div v-for="(album, index) in albums" :key="index" class="album">
          <a @click="editAlbum(album.name)" style="cursor: pointer;">
            <div v-if="album.photos.length > 0">
              <img :src="album.photos[0].url" alt="相簿封面" width="100" height="100" />
            </div>
            <h2>{{ album.name }}</h2>
            <p>上傳者: {{ album.uploaderName }} ({{ album.uploaderRole }})</p>
          </a>
          <button v-if="album.uploaderName === currentUserName" @click="deleteAlbum(album.name)">刪除相簿</button>
        </div>
      </div>
    </div>
    <div v-else>
      <button @click="selectedAlbum = ''" style="cursor: pointer;border: none;background-color: hsl(197, 54%, 65%);border-radius: 4px;font-weight: bolder;margin-bottom: 1.5%;padding: 5px;">返回</button>
      <h1>{{ selectedAlbum }}</h1>
      <div class="edit-album-name">
        <input type="text" v-model="newAlbumName" placeholder="輸入新的相簿名稱">
        <button @click="updateAlbumName">修改相簿名稱</button>
      </div>
      <div class="upload">
        <h3>新增照片</h3>
        <input type="file" @change="uploadPhoto" multiple>
      </div>
      <div class="photos">
        <div v-for="(photo, index) in photos" :key="index" class="photo">
          <input type="checkbox" v-model="selectedPhotos" :value="photo.url">
          <a :href="photo.url" target="_blank">
            <img :src="photo.url" :alt="photo.title">
          </a>
          <p>{{ photo.title }}</p>
          <p>上傳者: {{ photo.uploaderName }} ({{ photo.uploaderRole }})</p>
        </div>
      </div>
      <button class="delete" @click="deleteSelectedPhotos" v-if="selectedPhotos.length > 0">刪除選定的照片</button>
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
      newAlbumName: '', // 新的相簿名稱
      currentUserName: this.$store.state.userName, // 當前用戶名稱
      selectedPhotos: [] // 儲存選中的照片URL
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
    editAlbum(albumName) {
      this.selectedAlbum = albumName;
      this.newAlbumName = albumName; // 初始化新的相簿名稱
      fetch(`http://localhost:8080/business/getPhotos?albumName=${encodeURIComponent(albumName)}`)
        .then(response => response.json())
        .then(data => {
          this.photos = data;
        })
        .catch(error => {
          console.error('Error:', error);
        });
    },
    deletePhoto(url) {
      if (confirm("確定要刪除這張照片嗎？")) {
        fetch(`http://localhost:8080/business/deletePhoto?albumName=${encodeURIComponent(this.selectedAlbum)}&url=${encodeURIComponent(url)}&uploaderName=${encodeURIComponent(this.currentUserName)}`, {
          method: 'POST'
        })
        .then(response => response.json())
        .then(ret => {
          if (ret.code === 0) {
            alert(ret.message);
            this.photos = this.photos.filter(photo => photo.url !== url);
          } else {
            alert(ret.message);
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert("刪除失敗，請檢查網絡後重試");
        });
      }
    },

    deleteSelectedPhotos() {
  // 過濾出不是自己上傳的照片
  const notUserPhotos = this.selectedPhotos.filter(url => {
    const photo = this.photos.find(photo => photo.url === url);
    return photo && photo.uploaderName !== this.currentUserName;
  });

  // 如果有不是自己上傳的照片，提示並阻止刪除
  if (notUserPhotos.length > 0) {
    alert("您選中非自己上傳的照片，請重新選擇。");
    return;
  }

  // 過濾出只有自己上傳的照片
  const userPhotosToDelete = this.selectedPhotos.filter(url => {
    const photo = this.photos.find(photo => photo.url === url);
    return photo && photo.uploaderName === this.currentUserName;
  });

  if (userPhotosToDelete.length === 0) {
    alert("您沒有選中任何自己上傳的照片。");
    return;
  }

  if (confirm("確定要刪除選定的照片嗎？")) {
    const requests = userPhotosToDelete.map(url => {
      return fetch(`http://localhost:8080/business/deletePhoto?albumName=${encodeURIComponent(this.selectedAlbum)}&url=${encodeURIComponent(url)}&uploaderName=${encodeURIComponent(this.currentUserName)}`, {
        method: 'POST'
      });
    });

    Promise.all(requests)
      .then(responses => Promise.all(responses.map(response => response.json())))
      .then(results => {
        results.forEach(ret => {
          if (ret.code === 0) {
            this.photos = this.photos.filter(photo => !userPhotosToDelete.includes(photo.url));
          } else {
            alert(ret.message);
          }
        });
        this.selectedPhotos = []; // 清空選中的照片
      })
      .catch(error => {
        console.error('Error:', error);
        alert("刪除失敗，請檢查網絡後重試");
      });
  }
}
,

    deleteAlbum(albumName) {
      if (confirm("確定要刪除這個相簿嗎？")) {
        fetch(`http://localhost:8080/business/deleteAlbum?albumName=${encodeURIComponent(albumName)}&uploaderName=${encodeURIComponent(this.currentUserName)}`, {
          method: 'POST'
        })
        .then(response => response.json())
        .then(ret => {
          if (ret.code === 0) {
            alert(ret.message);
            this.albums = this.albums.filter(album => album.name !== albumName);
            this.selectedAlbum = '';
          } else {
            alert(ret.message);
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert("刪除失敗，請檢查網絡後重試");
        });
      }
    },
    async uploadPhoto(event) {
      const fileInput = event.target;
      const files = Array.from(fileInput.files);

      const data = new FormData();
      data.append('albumName', this.selectedAlbum);
      data.append('uploaderName', this.currentUserName); // 獲取使用者名稱
      data.append('uploaderRole', this.$store.state.userType); // 獲取使用者身分
      for (let file of files) {
        if (!/\.(png|jpg|bmp|gif|PNG|JPG|BMP|GIF)$/.test(file.name)) {
          alert("類型必須是圖片(.png|jpg|bmp|gif|PNG|JPG|BMP|GIF)");
          return false;
        }
        data.append('files', file);
      }

      try {
        const response = await fetch("http://localhost:8080/business/uploadPhotosToAlbum", {
          method: 'POST',
          body: data,
        });

        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }

        const ret = await response.json();

        if (ret.code === 0) {
          this.photos = this.photos.concat(ret.result.urls.map(url => ({ url, title: '', uploaderName: this.currentUserName, uploaderRole: this.$store.state.userType })));
          alert(ret.message);
        } else {
          alert(ret.message);
        }
      } catch (error) {
        console.error('Error:', error);
        alert("上傳失敗，請檢查網絡後重試");
      }
    },
    updateAlbumName() {
      if (!this.newAlbumName.trim()) {
        alert("新的相簿名稱不能為空");
        return;
      }
      fetch("http://localhost:8080/business/updateAlbumName", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          oldName: this.selectedAlbum,
          newName: this.newAlbumName,
          uploaderName: this.currentUserName // 提供當前使用者名稱
        })
      })
      .then(response => response.json())
      .then(ret => {
        if (ret.code === 0) {
          alert(ret.message);
          this.selectedAlbum = this.newAlbumName;
          this.fetchAlbums();
        } else {
          alert(ret.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert("修改相簿名稱失敗，請檢查網絡後重試");
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
  height: 100%;
  padding: 3% 3.5%;
  background-color: #ffffff;
}

h1{
  
}
h3{
  font-weight: bolder;
  text-align: center;
  margin-bottom: 10px;
}

input{
  display: block;
  margin: 0 auto;
  margin-bottom: 2%;
}

h1 {
  font-weight: bolder;
  text-align: center;
}

.albums {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

h2{
  font-weight: bolder;
}

.albums .album {
  background: #f0f0f0;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  text-align: center;
}

img {
  filter: grayscale(100%);
  -webkit-filter: grayscale(100%);
  -webkit-transition: all 1s ease;
  &:hover {
    filter: grayscale(0%);
    filter: gray;
    -webkit-filter: grayscale(0%);
    filter: none;
    transition: 1s ease;
  }
}

.albums .album button {
  top: 10px;
  right: 10px;
  background-color: hsl(197, 54%, 65%);
  color: black;
  font-weight: bolder;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 5px;
}

.albums .album button:hover {
  background-color: hsl(197, 54%, 65%);
  box-shadow: 2px 2px 3px hsl(0, 0%, 79%);
}

.photos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.photo {
  background: #f9f9f9;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.photo img {
  width: 100%;
  height: auto;
}

.photo p {
  margin-top: 10px;
  font-size: 16px;
  color: #555;
}

.photo button {
  margin: 0 auto;
  display: block;
  margin-top: 10px;
  padding: 5px 10px;
  background-color: hsl(197, 54%, 65%);
  color: black;
  font-weight: bolder;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.photo button:hover {
  background-color: hsl(197, 54%, 65%);
  box-shadow: 2px 2px 3px hsl(0, 0%, 79%);
}

.upload {
  margin-top: 20px;
}

.edit-album-name {
  margin-bottom: 20px;
  text-align: center;
}

.edit-album-name input {
  padding: 10px;
  width: 60%;
  margin: 0 auto;
  margin-bottom: 10px;
}

.edit-album-name button {
  background-color: hsl(197, 54%, 65%);
  color: black;
  font-weight: bolder;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 10px 20px;
}

.edit-album-name button:hover {
  background-color: hsl(197, 54%, 65%);
  box-shadow: 2px 2px 3px hsl(0, 0%, 79%);
}

.delete {
  background-color: hsl(197, 54%, 65%);
  color: black;
  font-weight: bolder;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 10px 20px;
}

.delete:hover {
  background-color: hsl(197, 54%, 65%);
  box-shadow: 2px 2px 3px hsl(0, 0%, 79%);
}
</style>
