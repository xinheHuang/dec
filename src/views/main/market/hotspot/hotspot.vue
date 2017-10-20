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
       <span v-for="type in chartTypes"
             :class="{'selected':selectedChartType==type.name}"
             @click="changeChartType(type)">
         {{type.name}}
       </span>
      </div>
      <div class="charts">
        <div>

          <div style="width: 100%;text-align: left;vertical-align: middle">
            <div v-if="!barChartData ">加载中</div>
            <div v-else-if="barChartData.length===0 ">暂无数据</div>
            <div v-else>
              <barchart :data="barChartData"
                        :y-label="['总阅读数','过去一周']"
                        :height="300"
                        :width="450"></barchart>
            </div>
          </div>
        </div>
        <div>
          <div style="width: 100%;text-align: center;">
            <div v-if="!areaChartData ">加载中</div>
            <div v-else-if="areaChartData.length===0 ">暂无数据</div>
            <div v-else
                 style="display: flex">
              <areachart
                style="flex-shrink: 0"
                :data="areaChartData"
                :keys="areaChartKeys"
                y-label="阅读比例"
                :height="300"
                :width="400"></areachart>
              <legends :keys="areaChartKeys"
                       style="margin-left: 10px;flex-shrink: 0"></legends>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--列表部分-->
    <div class="section">
      <div class="list">
        <div @click="onLeft"
             :class="{'disable':slickLeftDisable}"
             class="icon-angle"
        >
          <icon name="angle-left"></icon>
        </div>

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

        <div @click="onRight"
             :class="{'disable':slickRightDisable}"
             class="icon-angle"
        >
          <icon name="angle-right"></icon>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import conclusion from '../conclusion/conclusion.vue'
  import keyWordList from './keyWordList/keyWordList.vue'
  import Slick from 'vue-slick'
  import barchart from './barchart/barchart.vue'
  import areachart from './areachart/areachart.vue'
  import legends from './legend/legend.vue'
  import * as d3 from 'd3'
  import {dateString} from 'Util'

  export default {
    data() {
      return {
        subCategory: {},  // 二级行业对应的一级行业
        readNumberData: [],  //总阅读数量数据
        categories: [], //一级行业
        articleRelations: {},  //所有文字topic relation
        conclusions: [],
        articleData: {},
        areaChartKeys: [],
        barChartData: null,
        areaChartData: null,
        selectedChartType: null,
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
    computed: {
      chartTypes() {
        return [{name: '全部'}, ...this.categories]
      }
    },
    methods: {
      changeBarChart(type) {
        let data
        if (type.name === '全部') {
          data = this.readNumberData
        }
        else {
          const subCategories = type.subCategories.map((c) => c.name)
          data = this.readNumberData.filter(
            (d) => subCategories.includes(d['relation.industry']))
        }
        this.barChartData = data.map((d) => {
          return {
            x: d['relation.name'],
            y: Number(d['sum'])
          }
        })
                                .sort((a, b) => b.y - a.y)  //barchart 数据
      },
      changeAreaChart(type) {
        let category  //分类
        category = (type.name === '全部' ? this.categories : type.subCategories).map((c) => c.name)
        let data
        data = Object.keys(this.articleRelations)
                     .map((key) => {
                       const articles = this.articleRelations[key]
                       const group = category.reduce((prev, c) => ({
                         ...prev,
                         [c]: 0
                       }), {})
                       articles.filter((article) => article.industry)
                               .forEach((article) => {
                                 const industry = type.name === '全部' ? this.subCategory[article.industry].name :
                                                  article.industry
                                 if (category.includes(industry)) {
                                   group[industry] += article.num_read  //统计该分类下那一周的阅读量
                                 }
                               })
                       return {
                         date: key,
                         group
                       }
                     })

        const parseTime = d3.timeParse('%Y-%m-%d')
        this.areaChartData = data.map((d) => {
          const total = Object.values(d.group)
                              .reduce((prev, s) => prev + s, 0)
          return {
            date: parseTime(d.date),
            ...Object.keys(d.group)
                     .reduce((prev, key) => {
                       return {
                         ...prev,
                         [key]: total === 0 ? 1 / Object.keys(d.group).length : d.group[key] / total  //计算百分比
                       }
                     }, {})
          }
        })
                                 .sort((a, b) => a.date > b.date ? 1 : -1) //按时间排序
        this.areaChartKeys = category
      },

      changeChartType(type) {  //改变图表的选择
        if (type.name === this.selectedChartType) return
        this.selectedChartType = type.name
        this.changeBarChart(type)
        this.changeAreaChart(type)

      },
      onLeft() {  //左箭头点击
        if (this.$refs.slick)
          this.$refs.slick.prev()
      },
      onRight() {  //右箭头点击
        if (this.$refs.slick)
          this.$refs.slick.next()
      },
      changeSlick: function (event, slick, slide) {
        this.slickRightDisable = slide >= this.articleData.length - 3
        this.slickLeftDisable = slide <= 0
      },
    },
    components: {
      conclusion,
      keyWordList,
      Slick,
      barchart,
      areachart,
      legends
    },
    mounted() {
      this.$http.get('/api/market/articles')  //获取所有文章
          .then(res => {
            const articleData = {}
            res.filter(article => article.relation)
               .forEach((article) => {
                 if (!articleData[article.relation.name]) {
                   articleData[article.relation.name] = []
                 }
                 article.date = new Date(article.riqi)
                 articleData[article.relation.name].push(article)
               })
            this.articleData = Object.keys(articleData)
                                     .map((topic) => {
                                       const articles = articleData[topic]
                                       const readNumber = articles.reduce(
                                         (prev, article) => prev + article.num_read,
                                         0)
                                       articles.sort(
                                         (a, b) => a.date > b.date ? -1 : 1)
                                       return {
                                         key: topic,
                                         readNumber,
                                         items: articles
                                       }
                                     })
                                     .sort(
                                       (a, b) => b.readNumber - a.readNumber)

            this.$nextTick(() => {
              this.$refs.slick.reSlick()
              this.changeSlick(null, null, 0)
            })

          })

      this.$http.get('/api/market/conclusion')  //获取所有结论
          .then(res => {
            this.conclusions = res.content1
          })


      //获取过去7天阅读总量 根据topic 行业
      Promise.all([this.$http.get('/api/market/readNumbersLast7Days'), this.$http.get('api/market/articleRelations'),
                   this.$http.get('/api/market/categories')])
             .then(([res1, res2, res3]) => {
               this.readNumberData = res1

               const data = {}
               res2.forEach(d => {
                 const date = new Date(d.riqi)
                 const day = date.getDay()
                 const sunday = new Date(date.getTime() + (day === 0 ? 0 :
                                                           (7 - day)) * 60 * 60 * 24 * 1000)
                 const stringSunday = dateString(sunday)  //计算那一周的周日
                 if (!data[stringSunday]) {
                   data[stringSunday] = []
                 }
                 data[stringSunday].push(d)
               })
               this.articleRelations = data
               this.categories = res3
               //获取所有二级行业
               return Promise.all(
                 this.categories.map((category) => this.$http.get(`/api/market/categories/${category.CID}`)))
             })
             .then(arr => {
               arr.forEach((res, index) => {
                 const category = this.categories[index]
                 category.subCategories = res
                 res.forEach((c) => {
                   this.subCategory[c.name] = category
                 })
               })
               //图表默认全部
               this.changeChartType({name: '全部'})
             })
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
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
    >*{
      width: 80px;
      height: 80px;
    }
    color: #6b6868;
    &.disable{
      color: #e2dddd;
    }
  }

</style>
