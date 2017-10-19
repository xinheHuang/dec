/**
* Created by Xinhe on 2017/10/9.
*/
<template>
  <div>
    <div class="interest">
      <span>已关注行业：</span>
      <div>
      <span v-for="industry in industries"
            class="button-gray">
        {{industry.name}}
      </span>
      </div>
    </div>

    <div class="interest">
      <span>已关注个股：</span>
      <div>
      <span v-for="stock in stocks"
            class="button-gray">
        {{stock.name}}{{stock.code}}
      </span>
      </div>
    </div>

    <div style="display: flex;align-items: center;justify-content: space-between">
      <search-bar :search="search"
                  placeHolder="搜索行业或个股"/>
      <span class="button-blue"
            @click="interest()">
          点击关注
        </span>
    </div>

    <div class="search-result">
      <div class="stocks">
          <span v-for="stock in searchedStocks"
                :class="selected==stock?'button-blue':'button-gray'"
                @click="select(stock,'stock')">
            {{stock.name}}{{stock.code}}
          </span>
      </div>
      <div class="industries">
           <span v-for="industry in searchedIndustries"
                 :class="selected==industry?'button-blue':'button-gray'"
                 @click="select(industry,'industry')">
            {{industry.name}}
          </span>
      </div>
    </div>

  </div>
</template>

<script>
  import SearchBar from 'Component/searchBar/searchBar.vue'
  import EventBus from '@/eventBus'

  export default {
    data() {
      return {
        stocks: [],
        industries: [],
        searchedStocksSet: new Set(),
        searchedIndustriesSet: new Set(),
        selected: null,
        selectedType: null,
      }
    },
    computed: {
      searchedStocks() {
        return Array.from(this.searchedStocksSet)
                    .filter((stock) => !this.stocks.includes(stock))
      },
      searchedIndustries() {
        return Array.from(this.searchedIndustriesSet)
                    .filter((industry) => !this.industries.includes(industry))
      }
    },
    methods: {
      clearSelect() {
        this.selected = null
        this.selectedType = null
      },
      select(data, type) {
        if (data == this.selected) {
          this.clearSelect()
          return
        }
        this.selectedType = type
        this.selected = data
      },
      interest() {
        if (this.selected == null) {
          EventBus.$emit("errorDialog", {
            text: '前先选择'
          })
          return
        }
        switch (this.selectedType) {
          case 'stock':
            this.$http.post('api/interests/stock', {SID: this.selected.ID})
                .then((res) => {
                  console.log('added', res)
                  this.stocks.push(this.selected)
                  this.clearSelect()
                })
            break
          case 'industry':
            this.$http.post('api/interests/industry', {CID: this.selected.CID})
                .then((res) => {
                  console.log('added', res)
                  this.industries.push(this.selected)
                  this.clearSelect()
                })
            break
        }
      },
      search(key) {
        this.$http.get(`/api/interests?key=${key || ''}`)
            .then((searchRes) => {
              console.log(searchRes)
              this.searchedStocksSet = new Set(searchRes.stocks)
              this.searchedIndustriesSet = new Set(searchRes.industries)
            })
      }
    },
    mounted() {
      this.$http.get('/api/interests/industry')
          .then((industries) => {
            this.industries = industries
          })
      this.$http.get('/api/interests/stock')
          .then((stocks) => {
            this.stocks = stocks
          })
    },
    components: {
      SearchBar
    }
  }
</script>

<style lang="less"
       scoped>
  .interest {
    display: flex;
    align-items: baseline;
    margin: 20px 0;
    >span{
      flex-shrink: 0;
    }
    >div{
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      /*justify-content: space-between;*/
      span {
        display: inline-block;
        margin: 10px;
      }
    }

  }

  .search-result {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    /*justify-content: space-between;*/
    align-items: center;
    span {
      display: inline-block;
      margin: 10px;

    }
  }
</style>
