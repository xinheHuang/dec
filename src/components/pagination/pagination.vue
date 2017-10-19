<template>
  <div class="pagination">
    <paginate :page-count="total"
              :page-range="3"
              :margin-pages="2"
              :prev-text="'上一页'"
              :next-text="'下一页'"
              :click-handler="changePage"
              page-link-class="item"
              prev-link-class="item"
              next-link-class="item"
              :no-li-surround="true"
              ref="paginate"
              >
    </paginate>
  </div>
</template>
<script>
  import Paginate from 'vuejs-paginate'
  //  Vue.component('paginate', Paginate)
  export default {
    props: {
      changePage: Function,
      total: Number,
      pageSize: Number,
    },
    data() {
      return {
        paginationOptions: { // Not required to pass this configurations
          offset: 5,
          previousText: '上一页',
          nextText: '下一页',
          alwaysShowPrevNext: true
        }
      }
    },
    methods: {
      pageChanged(page) {
        console.log(page)
      },
      setPage(page){
        this.$refs.paginate.selected=page;
      }
    },
    components: {
      Paginate
    }
  }
</script>
<style lang="less">
  @import (reference) '../../assets/styles/common';

  .pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .item {
      .button-blue;
      border-radius: 0;
      margin: 10px;
      &.disabled {
        color: @gray;
      }
      &.active {
        background: @blue;
        color: @white;
      }
    }
  }

</style>
