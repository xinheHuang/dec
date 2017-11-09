<!--文章弹窗-->
<template>
  <modal @close="close()">
    <div slot="title">
      <div v-if="!article">加载中</div>
      <div v-else>
        <div style="text-align: center">
          <h3 style="color:black;">
            {{article.title}}
          </h3>
        </div>
        <div class="info">
          <span><icon name="calendar-o"/><span>{{dateFormat(new Date(article.time))}}</span></span>
          <span><icon name="user"/><span>{{article.author}}</span></span>
          <span><icon name="eye"/><span>{{article.num_read}}</span></span>
          <span><icon name="heart"/><span>{{article.num_like}}</span></span>
        </div>
        <div class="divider"></div>
      </div>
    </div>
    <div slot="body" v-if="article">
      <div v-html="article.content"></div>
    </div>
  </modal>
</template>

<script>

  import { dateFormat } from 'Util'
  import modal from 'Component/modal/modal.vue'
  import EventBus from '@/eventBus'

  export default {
    props: {
      modalData: {  //弹窗文章的属性
        type: Number,
        required: true,
      }
    },
    data() {
      return {
        article: null,
      }
    },
    methods: {
      close() {
        EventBus.$emit('closeModal')
      },
      dateFormat,
    },
    mounted() {
      this.$http.get(`/api/article/${this.modalData}`)
        .then(res => {
          this.article = res
        })
    },
    components: {
      modal
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .info {
    display: flex;
    justify-content: center;
    color: #6b6868;
    font-size: 14px;
    margin-bottom: 5px;

    > span {
      display: flex;
      align-items: center;
      margin-right: 20px;

      > span {
        margin-left: 10px;
      }

    }
  }


</style>
