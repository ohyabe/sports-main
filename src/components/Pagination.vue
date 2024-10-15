<template>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">上一頁</button>
      <ul>
        <li v-for="pageNumber in pageCount" :key="pageNumber" :class="{ 'active': pageNumber === currentPage }">
          <a @click="handlePageClick(pageNumber)">{{ pageNumber }}</a>
        </li>
      </ul>
      <button @click="nextPage" :disabled="currentPage === pageCount">下一頁</button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      currentPage: {
        type: Number,
        required: true
      },
      pageCount: {
        type: Number,
        required: true
      },
      handlePageClick: {
        type: Function,
        required: true
      },
      prevPage: {
        type: Function,
        required: true
      },
      nextPage: {
        type: Function,
        required: true
      }
    }
  };
  </script>
  
  <style scoped>
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }
  .pagination ul {
    list-style-type: none;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .pagination li {
    margin: 0 5px;
  }
  .pagination li a {
    text-decoration: none;
    padding: 5px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
  }
  .pagination li.active a {
    background-color: rgb(46, 66, 114);
    color: white;
    border-color: rgb(46, 66, 114);
    transition: background-color 0.3s ease;
  }
  .pagination button {
    margin: 0 5px;
    padding: 5px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    background-color: #f2f2f2;
    
  }
  .pagination button:hover:not([disabled]) {
    background-color: rgb(46, 66, 114);
    color: white;
    border-color: rgb(46, 66, 114);
    transition: background-color 0.3s ease;
  }
  .pagination button:disabled {
    background-color: #ccc;
    color: #666;
    cursor: not-allowed;
  }
  </style>
  