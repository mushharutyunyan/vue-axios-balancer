<template>
  <div class="p-4 flex flex-col gap-y-8">
    <p class="text-xl">Chuck norris - random block</p>
    <div class="grid grid-cols-2 gap-x-2">
      <div class="flex flex-col gap-y-4 p-2 border-2 rounded-md max-h-96 overflow-y-auto overflow-x-hidden">
        <div class="flex">
          <div class="flex flex-col">
            <label>Random rows qty</label>
            <input type="number" v-model="randomRowsQty"
                   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
          </div>
        </div>
        <div>
          <div v-for="row in randomData" class="p-2 text-center rounded-md border-2">
            <p>{{ row.value }}</p>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-y-4 p-2 border-2 rounded-md max-h-96 overflow-y-auto overflow-x-hidden">
        <div>
          <input type="text" v-model="search"
                 class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                 placeholder="Search (min. 3 symbols)">
        </div>
        <div v-if="searchData.total && searchData.total > 0">
          <div v-for="row in searchData.result" class="p-2 text-center rounded-md border-2">
            <p>{{ row.value }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from '../api/chuckNorrisApi';
import {synced, searched} from '../api/api'
export default {
  data() {
    return {
      search: null,
      randomRowsQty: 3,
      randomData: synced.randomJoke.data,
      searchData: searched.searchJoke.data
    }
  },
  watch: {
    search() {
      if(this.search && this.search.length > 2) {
        api.searchJoke({
          query: this.search
        })
      }
    },
    randomRowsQty() {
      if(this.randomRowsQty > 50) {
        alert('max random rows can not be more than 50');
        this.randomRowsQty = 3;
      } else {
        this.randomRows();
      }
    }
  },
  methods: {
    randomRows() {
      for(let i = 1; i <= this.randomRowsQty; i++) {
        api.getRandomJoke()
      }
    },
  },
  mounted() {
    this.randomRows();
  }
};
</script>
