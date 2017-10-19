<template>
  <div class="pagination">
    <pagination :total="total"
                :page-size="pageSize"
                :callback="changePage"
                :options="paginationOptions">
    </pagination>
  </div>
</template>
<script>
  import pagination from 'vue-pagination-bootstrap'

  export default {
    props: {
      changePage: Function,
      total:Number,
      pageSize:Number,
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
      }
    },
    components: {
      pagination
    }
  }
</script>
<style lang="less">
  @import (reference) '../../assets/styles/common';

  .pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;

    li {
      .button-blue;
      border-radius: 0;
      margin: 10px ;
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
