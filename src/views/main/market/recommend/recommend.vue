<template>
  <div>
    <!--结论部分-->
    <div class="section">
      <conclusion :conclusions="conclusions"></conclusion>
    </div>

    <!--列表部分-->
    <div class="section">
      <!--todo replace by content nav-->
      <category-menu @switchTab="switchTab"></category-menu>
      <div class="list">
        <div @click="onLeft($refs.companySlick)"
             :class="{'disable':companySlickLeftDisable}"
             class="icon-angle"
        >
          <icon name="angle-left"></icon>
        </div>

        <slick class="slick"
               ref="companySlick"
               v-if="companyLists.length>0"
               :options="slickOptions"
               v-on:afterChange="changeCompanySlick"
               style="width: 900px">
          <company-list v-for="companyList in companyLists"
                        @companySelect="companySelect"
                        :key="companyList.group"
                        :selected="currentSelect==companyList"
                        class="list-item"
                        :companyList="companyList">


          </company-list>
        </slick>

        <div @click="onRight($refs.companySlick)"
             :class="{'disable':companySlickRightDisable}"
             class="icon-angle"
        >
          <icon name="angle-right"></icon>
        </div>
      </div>
    </div>

    <!--第三部分-->
    <div class="section"
         v-if="currentSelect">
      <div>
        <h3>{{currentSelect.group}}</h3>
      </div>
      <div class="list">
        <div @click="onLeft($refs.slick)"
             :class="{'disable':slickLeftDisable}"
             class="icon-angle"
        >
          <icon name="angle-left"></icon>
        </div>

        <slick class="slick"
               ref="slick"
               v-if="selectDateList.length>0"
               :options="dateSlickOptions"
               @destroy="destroy"
               v-on:afterChange="changeSlick"
               style="width:900px">
          <date-list v-for="dateList in selectDateList"
                     class="list-item"
                     :key="currentSelect.group+dateList.date"
                     @select="selectDateItem"
                     :selected="currentSelectRecommend"
                     :dateList="dateList">

          </date-list>
        </slick>

        <div @click="onRight($refs.slick)"
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
  import companyList from './companyList/comnpanyList.vue'
  import Slick from 'vue-slick'
  import CategoryMenu from './menu/menu.vue'
  import ContentNav from 'Component/contentNav/contentNav.vue'
  import dateList from './dateList/dateList.vue'
  import { dateFormat } from '../../../../utils'

  export default {
    data() {
      return {
        conclusions: [],
        companyLists: [],

        slickOptions: {
          accessibility: false,
          slidesToShow: 3,
          draggable: false,
          arrows: false,
          infinite: false,
          touchMove: false,
          // Any other options that can be got from plugin documentation
        },
        dateSlickOptions: {
          accessibility: false,
          slidesToShow: 5,
          draggable: false,
          arrows: false,
          infinite: false,
          touchMove: false,
          // Any other options that can be got from plugin documentation
        },
        currentTab: null,

        currentSelect: null,
        currentSelectRecommend: null,
        selectDateList: null,

        companySlickLeftDisable: true,
        companySlickRightDisable: false,
        slickLeftDisable: true,
        slickRightDisable: false,
      }
    },
    methods: {

      destroy() {
        console.log('destroy')
      },
      switchTab(menu) {
        if (this.currentTab === menu.CID)
          return
        this.currentTab = menu.CID
        this.currentSelect = null
        Promise.all(
          [this.$http.get(`/api/market/industry/${menu.name}/articles`),
            this.$http.get(`/api/market/industry/${menu.name}/people`)])
          .then(([articleRes, peopleRes]) => {
            const companies = {}
            articleRes.filter((article) => article.broker)
              .forEach(article => {
                if (!companies[article.broker]) {
                  companies[article.broker] = {
                    articles: [],
                    people: [],
                  }
                }
                article.date = new Date(article.riqi)
                companies[article.broker].articles.push(article)
              })

            peopleRes.forEach(people => {
              if (!companies[people.broker]) {
                companies[people.broker] = {
                  articles: [],
                  people: [],
                }
              }
              companies[people.broker].people.push(people)
            })
            this.companyLists = []
            this.$nextTick(() => {
              this.companyLists = Object.keys(companies)
                .map((company) => ({
                  group: `${company}公司${menu.name}组`,
                  articles: this.getDiffArticles(companies[company].articles),
                  people: companies[company].people
                }))
              this.$nextTick(() => {
                if (this.$refs.slick)
                  this.$refs.companySlick.reSlick()
                this.changeCompanySlick(null, null, 0)
              })
            })


          })

      },

      getDiffArticles(articles) {
        return articles.map((article, index, arr) => {
          const currentSet = new Set(article.recommends.filter(recommend => recommend.relation)
            .map((recommend) => recommend.relation.name))
          const prevSet = index === arr.length - 1 ? new Set() : new Set(arr[index + 1].recommends
            .filter(recommend => recommend.relation)
            .map((recommend) => recommend.relation.name))
          return {
            ...article,
            plus: [...currentSet].filter(x => !prevSet.has(x))
              .reduce((prev, x) => `${prev}${prev && ','}${x}`, ''),
            minus: [...prevSet].filter(x => !currentSet.has(x))
              .reduce((prev, x) => `${prev}${prev && ','}${x}`, '')
          }
        })
          .filter((article) => article.plus || article.minus)
      },

      onLeft(ref) {  //左箭头点击
        if (ref)
          ref.prev()
      },
      onRight(ref) {  //右箭头点击
        if (ref)
          ref.next()
      },
      companySelect(company) {  //选择行业类别
        if (company === this.currentSelect)
          return
        this.currentSelect = company
        this.currentSelectRecommend = null
        const selectDateList = {}
        company.articles.forEach((article) => {
          if (!selectDateList[dateFormat(article.date)]) {
            selectDateList[dateFormat(article.date)] = new Set()
          }
          article.recommends.filter(recommend => recommend.relation)
            .forEach(recommend => {
              selectDateList[dateFormat(article.date)].add(recommend)
            })
        })
        this.selectDateList = []

        this.$nextTick(() => {
          this.selectDateList = Object.keys(selectDateList)
            .map(date => {
              return {
                date,
                recommends: [...selectDateList[date]]
              }
            })
          this.$nextTick(() => {
            if (this.$refs.slick)
              this.$refs.slick.reSlick()
            this.changeSlick(null, null, 0)
            window.scrollTo(0, document.body.scrollHeight)
          })
        })

      },
      selectDateItem(item) {  //选择日期下某一个条目
        this.currentSelectRecommend = item
      },
      changeCompanySlick: function (event, slick, slide) {
        this.companySlickRightDisable = slide >= this.companyLists.length - 3
        this.companySlickLeftDisable = slide <= 0
      },

      changeSlick: function (event, slick, slide) {
        this.slickRightDisable = slide >= this.selectDateList.length - 5
        this.slickLeftDisable = slide <= 0
      }

    },
    components: {
      conclusion,
      companyList,
      Slick,
      CategoryMenu,
      dateList,
      ContentNav
    },
    mounted() {
      this.$http.get('/api/market/conclusion')
        .then(res => {
          this.conclusions = res.content2
        })
      this.$http.get('/api/market/categories')
        .then(res => {
          this.menu = res
        })
    },

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped
       lang="less">

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

  .list .icon-angle {
    cursor: pointer;
    > * {
      width: 80px;
      height: 80px;
    }
    color: #6b6868;
    &.disable {
      color: #e2dddd;
    }
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

</style>
