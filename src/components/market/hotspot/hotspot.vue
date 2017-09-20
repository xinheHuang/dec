<!--关注热点-->
<template>
  <div>
    <!--结论部分-->
    <div class="section">
      <conclusion :conclusions="conclusions"></conclusion>
    </div>

    <!--图表部分-->
    <div class="section">
      <div class="charts-type">
       <span v-for="type in data.chartTypes"
             :class="{'selected':selectedChartType==type}"
             @click="changeChartType(type)">
         {{type}}
       </span>
      </div>
      <div class="charts">
        <div>
          <div class="chart-title">
            {{selectedChartType}}标题1
          </div>
          <div style="width: 100%;height:300px;text-align: center;vertical-align: middle;line-height: 300px">
            图表1
          </div>
        </div>
        <div>
          <div class="chart-title">
            {{selectedChartType}}标题2
          </div>
          <div style="width: 100%;height:300px;text-align: center;vertical-align: middle;line-height: 300px">
            图表2
          </div>
        </div>
      </div>
    </div>

    <!--列表部分-->
    <div class="section">
      <div class="list">
        <span class="icon-angle icon-angle-left"
              :class="{'disable':slickLeftDisable}"
              @click="onLeft"></span>

        <slick class="slick"
               ref="slick"
               v-on:afterChange="changeSlick"
               :options="slickOptions"
               style="width:
        900px">
          <key-word-list :key="keyWordList.key"
                         v-for="keyWordList in articleData"
                         class="list-item"
                         :keyWordList="keyWordList"></key-word-list>
        </slick>

        <span class="icon-angle icon-angle-right"
              :class="{'disable':slickRightDisable}"
              @click="onRight"></span>
      </div>
    </div>
  </div>
</template>

<script>
  import conclusion from '../conclusion/conclusion.vue'
  import keyWordList from './keyWordList/keyWordList.vue'
  import Slick from 'vue-slick'

  export default {
    data() {
      return {
        data: {   //关注热点静态数据， 后期需要通过ajax 获取数据
          chartTypes: [
            '全部', '科技', '消费', '周期', '能源', '金融',
          ],
        },
        conclusions: [],
        articleData: {},
        selectedChartType: '全部',
        slickOptions: {  // 滑动部分配置
          slidesToShow: 3,
          accessibility: false,
          draggable: false,
          arrows: false,
          infinite: false,
          touchMove: false,
          // Any other options that can be got from plugin documentation
        },
        slickLeftDisable: true,
        slickRightDisable: false,
      }
    },
    methods: {
      changeChartType(type) {
        this.selectedChartType = type

        //这里根据类型发起ajax 请求，刷新图表
      },
      onLeft() {  //左箭头点击
        this.$refs.slick.prev()
      },
      onRight() {  //右箭头点击
        this.$refs.slick.next()
      },
      changeSlick: function (event, slick, slide) {
        this.slickRightDisable = slide >= this.articleData.length - 3
        this.slickLeftDisable = slide <= 0
      }
    },
    components: {
      conclusion,
      keyWordList,
      Slick
    },
    mounted() {
      this.$http.get('/api/market/articles')
        .then(res => {
          const articleData = {}
          res.data.forEach((article) => {
            if (!articleData[article.topic]) {
              articleData[article.topic] = []
            }
            article.date = new Date(article.riqi)
            articleData[article.topic].push(article)
          })
          this.articleData = Object.keys(articleData)
            .map((topic) => {
              const articles = articleData[topic]
              const readNumber = articles.reduce((prev, article) => prev + article.num_read, 0)
              articles.sort((a, b) => a.date > b.date ? -11 : 1)
              return {
                key: topic,
                readNumber,
                items: articles
              }
            })
          console.log(this.articleData)
          this.$nextTick(() => {
            console.log('reslick')
            this.$refs.slick.reSlick()
          })
        })

      this.$http.get('/api/market/conclusion')
        .then(res => {
          this.conclusions = res.data.content1
        })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .section {
    background: white;
    border: 2px solid #e2dddd;
    margin: 20px;
    padding: 20px 60px;
  }

  .charts {
    margin-top: 20px;
    display: flex;

  }

  .charts > * {
    width: 50%;
  }

  .chart-title {
    text-align: center;
  }

  .charts-type span {
    padding: 2px 10px;
    background: #f6f6f6;
    margin-right: 20px;
    border-radius: 6px;
    text-align: center;
    border: 2px solid #f6f6f6;
    font-size: 12px;
    cursor: pointer;
    color: black;
  }

  .charts-type span.selected {
    background: #2c8abf;
    border-color: #2c8abf;
    color: white;
  }

  .list {
    display: flex;
    align-items: flex-start;
    justify-content: space-between
  }

  .list span {
    font-size: 80px;
    font-weight: lighter;
    color: #6b6868;
  }

  .slick {
    overflow: hidden;
    width: 900px;
  }

  .list-item {
    display: inline-block;
    vertical-align: top;
    outline: none;
  }

  .icon-angle {
    cursor: pointer;
  }

  .icon-angle.disable {
    color: #e2dddd;
  }


</style>
