<template>
  <div>
    <!--结论部分-->
    <div class="section">
      <conclusion :conclusions="conclusions"></conclusion>
    </div>

    <!--列表部分-->
    <div class="section">
      <category-menu @switchTab="switchTab"></category-menu>
      <div class="list">
        <span class="icon-angle icon-angle-left"
              :class="{'disable':companySlickLeftDisable}"
              @click="onLeft($refs.companySlick)"></span>
        <!--{{data.companyList[currentTab]}}-->
        <slick class="slick"
               v-if="companyLists.length>0"
               ref="companySlick"
               :options="slickOptions"
               v-on:afterChange="changeCompanySlick"
               style="width: 900px">
          <company-list v-for="companyList in companyLists"
                        @companySelect="companySelect"
                        :selected="currentSelect==companyList"
                        class="list-item"
                        :companyList="companyList">


          </company-list>
        </slick>

        <span class="icon-angle icon-angle-right"
              :class="{'disable':companySlickRightDisable}"
              @click="onRight($refs.companySlick)"></span>
      </div>
    </div>

    <!--第三部分-->
    <div class="section"
         v-if="currentSelect">
      <div>
        <h3>{{currentSelect.team}}：{{currentSelect.group}}</h3>
      </div>
      <div class="list">
        <span class="icon-angle icon-angle-left"
              :class="{'disable':slickLeftDisable}"
              @click="onLeft($refs.slick)"></span>

        <slick class="slick"
               ref="slick"
               :options="dateSlickOptions"
               v-on:afterChange="changeSlick"
               style="width:900px">
          <date-list v-for="dateList in data.dateList"
                     class="list-item"
                     :key="dateList.date"
                     @select="selectDateItem"
                     :selected="currentSelectDateItem"
                     :dateList="dateList">

          </date-list>
        </slick>

        <span class="icon-angle icon-angle-right"
              :class="{'disable':slickRightDisable}"
              @click="onRight($refs.slick)"></span>
      </div>
    </div>
  </div>
</template>

<script>
  import conclusion from '../conclusion/conclusion.vue'
  import companyList from './companyList/comnpanyList.vue'
  import Slick from 'vue-slick'
  import CategoryMenu from './menu/menu.vue'
  import dateList from './dateList/dateList.vue'

  export default {
    data() {
      return {
        data: {   //核心推荐静态数据， 后期需要通过ajax 获取数据
//          dateList: [
//            {
//              date: '9月1日',
//              items: [
//                'AAAA',
//                'BBBB',
//                'CCCC',
//                'DDDD',
//                'EEEE',
//              ]
//            },
//            {
//              date: '9月3日',
//              items: [
//                'AAAA',
//                'BBBB',
//                'DDDD',
//                FFFF',
//              ]
//            },
//            {
//              date: '9月7日',
//              items: [
//                'AAAA',
//                'BBBB',
//                'DDDD',
//                'FFFF',
//                'GGGG',
//              ]
//            },
//            {
//              date: '9月10日',
//              items: [
//                'BBBB',
//                'DDDD',
//                'FFFF',
//                'GGGG',
//                'CCCC',
//              ]
//            },
//            {
//              date: '9月15日',
//              items: [
//                'BBBB',
//                'DDDD',
//                'FFFF',
//                'GGGG',
//                'CCCC',
//              ]
//            },
//            {
//              date: '9月16日',
//              items: [
//                'AAAA',
//                'BBBB',
//                'CCCC',
//              ]
//            },
//            {
//              date: '9月22日',
//              items: [
//                'QQQQ',
//                'CCCC',
//              ]
//            },
//          ]
        },

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
        currentSelectDateItem: null,
        companySlickLeftDisable: true,
        companySlickRightDisable: false,
        slickLeftDisable: true,
        slickRightDisable: false,
      }
    },
    methods: {
      switchTab(menu) {
        this.currentTab = menu.CID
        Promise.all(
          [this.$http.get(`/api/market/industry/${menu.name}/articles`),
           this.$http.get(`/api/market/industry/${menu.name}/people`)])
               .then(([articleRes, peopleRes]) => {
                 console.log(menu.name, articleRes.data, peopleRes.data)
                 const companies = {}
                 articleRes.data.forEach(article => {
                   if (!companies[article.company]) {
                     companies[article.company] = {
                       articles:[],
                       people:[],
                     }
                   }
                   article.date = new Date(article.riqi)
                   companies[article.company].articles.push(article)
                 })

                 peopleRes.data.forEach(people=>{
                   if (!companies[people.company]) {
                     companies[people.company] = {
                       articles:[],
                       people:[],
                     }
                   }
                   companies[people.company].people.push(people)
                 })
                 console.log(companies)
                 this.companyLists = Object.keys(companies)
                                           .map((company) => ({
                                             group: `${company}公司${menu.name}组`,
                                             articles: companies[company].articles,
                                             people: companies[company].people
                                           }))
                 this.$nextTick(() => {
                   if (this.$refs.companySlick)
                     this.$refs.companySlick.reSlick()

                 })
                 this.changeCompanySlick(null, null, 0)
               })

      },
      onLeft(ref) {  //左箭头点击
        ref.prev()
      },
      onRight(ref) {  //右箭头点击
        ref.next()
      },
      companySelect(company) {  //选择行业类别
        console.log(company)
        this.currentSelect = company
        //刷新第三部分数据ajax 现在都用固定的数据
        //重置第三部分
        this.currentSelectDateItem = null
        this.$refs.slick.reSlick()
        this.slickLeftDisable = true
        this.slickRightDisable = false
        window.scrollTo(0, document.body.scrollHeight)
      },
      selectDateItem(item) {  //选择日期下某一个条目
        this.currentSelectDateItem = item
      },
      changeCompanySlick: function (event, slick, slide) {
        this.companySlickRightDisable = slide >= this.companyLists.length - 3
        this.companySlickLeftDisable = slide <= 0
      },

      changeSlick: function (event, slick, slide) {
        this.slickRightDisable = slide >= this.data.dateList.length - 5
        this.slickLeftDisable = slide <= 0
      }

    },
    components: {
      conclusion,
      companyList,
      Slick,
      CategoryMenu,
      dateList
    },
    mounted() {
      this.$http.get('/api/market/conclusion')
          .then(res => {
            this.conclusions = res.data.content2
          })
      this.$http.get('/api/market/categories')
          .then(res => {
            this.menu = res.data
            console.log(this.menu)
          })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .icon-angle.disable {
    color: #e2dddd;
  }

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

</style>
