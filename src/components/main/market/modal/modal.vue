<!--文章弹窗-->
<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div v-if="!article">加载中</div>
          <div v-else>
            <div class="modal-header">
              <div class="close">
                <a class="icon-close icon-circle-with-cross"
                   @click="$emit('close')"></a>
              </div>
              <div style="text-align: center">
                <h3 style="color:black;">
                  {{article.title}}
                </h3>
              </div>
              <div class="info">
                <span><icon name="calendar-o"/><span>{{dateFormat(new Date(article.riqi))}}</span></span>
                <span><icon name="user"/><span>{{article.author}}</span></span>
                <span><icon name="eye"/><span>{{article.num_read}}</span></span>
                <span><icon name="heart"/><span>{{article.num_like}}</span></span>
              </div>
              <div class="divider"></div>
            </div>

            <div class="modal-body">
              <div v-html="article.content"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import 'vue-awesome/icons/eye'
  import 'vue-awesome/icons/calendar-o'
  import 'vue-awesome/icons/user'
  import 'vue-awesome/icons/heart'
  import '../../../../assets/font/calendar/style.css'
  import '../../../../assets/font/close/style.css'
  import { dateFormat } from '../../../../utils'

  export default {
    props: {
      articleID: {  //弹窗文章的属性
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
      dateFormat,
    },
    mounted() {
      this.$http.get(`/api/market/article/${this.articleID}`)
        .then(res => {
          this.article = res
        })
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
