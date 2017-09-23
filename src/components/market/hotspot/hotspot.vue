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
          <div style="width: 100%;text-align: center;vertical-align: middle">
            <barchart :data="data.barChartData" :height="300" :width="400"></barchart>
          </div>
        </div>
        <div>
          <div class="chart-title">
            {{selectedChartType}}标题2
          </div>
          <div style="width: 100%;text-align: center;vertical-align: middle">
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
  import barchart from './barchart/barchart.vue'
  export default {
    data() {
      return {
        data: {   //关注热点静态数据， 后期需要通过ajax 获取数据
          chartTypes: [
            '全部', '科技', '消费', '周期', '能源', '金融',
          ],
          barChartData:[
            {
              "x": "A",
              "y": 0.08167
            },
            {
              "x": "B",
              "y": 0.01492
            },
            {
              "x": "C",
              "y": 0.02782
            },
            {
              "x": "D",
              "y": 0.04253
            },
            {
              "x": "E",
              "y": 0.12702
            },
            {
              "x": "F",
              "y": 0.02288
            },
            {
              "x": "G",
              "y": 0.02015
            },
            {
              "x": "H",
              "y": 0.06094
            },
            {
              "x": "I",
              "y": 0.06966
            },
            {
              "x": "J",
              "y": 0.00153
            },
            {
              "x": "K",
              "y": 0.00772
            },
            {
              "x": "L",
              "y": 0.04025
            },
            {
              "x": "M",
              "y": 0.02406
            },
            {
              "x": "N",
              "y": 0.06749
            },
            {
              "x": "O",
              "y": 0.07507
            },
            {
              "x": "P",
              "y": 0.01929
            },
            {
              "x": "Q",
              "y": 0.00095
            },
            {
              "x": "R",
              "y": 0.05987
            },
            {
              "x": "S",
              "y": 0.06327
            },
            {
              "x": "T",
              "y": 0.09056
            },
            {
              "x": "U",
              "y": 0.02758
            },
            {
              "x": "V",
              "y": 0.00978
            },
            {
              "x": "W",
              "y": 0.0236
            },
            {
              "x": "X",
              "y": 0.0015
            },
            {
              "x": "Y",
              "y": 0.01974
            },
            {
              "x": "Z",
              "y": 0.00074
            }
          ]
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
        slickRightDisable: true,
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
        console.log('change slick')
        this.slickRightDisable = slide >= this.articleData.length - 3
        this.slickLeftDisable = slide <= 0
      }
    },
    components: {
      conclusion,
      keyWordList,
      Slick,
      barchart
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
            }).sort((a,b)=> b.readNumber - a.readNumber)

          this.$nextTick(() => {
            this.$refs.slick.reSlick()
            this.changeSlick(null, null, 0)
          })

        })

      this.$http.get('/api/market/conclusion')
        .then(res => {
          this.conclusions = res.data.content1
        })
    },
//    beforeUpdate() {
//      if (this.$refs.slick) {
//        this.$refs.slick.destroy();
//      }
//
//    },
//    updated() {
//      if (this.$refs.slick && !this.$refs.slick.$el.classList.contains('slick-initialized')) {
//        this.$refs.slick.create();
//        this.changeSlick(null,null,0);
//      }
//    },
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
