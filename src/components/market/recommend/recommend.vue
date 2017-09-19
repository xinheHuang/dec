<template>
  <div>
    <!--结论部分-->
    <div class="section">
      <conclusion :conclusions="data.conclusions"></conclusion>
    </div>

    <!--列表部分-->
    <div class="section">
      <content-nav :menus="data.menu"
                   @switchTab="switchTab"
                   :enableSearch="false"></content-nav>
      <div class="list">
        <span class="icon-angle icon-angle-left"
              :class="{'disable':companySlickLeftDisable}"
              @click="onLeft($refs.companySlick)"></span>
        <!--{{data.companyList[currentTab]}}-->
        <slick class="slick"
               ref="companySlick"
               :options="slickOptions"
               v-on:afterChange="changeCompanySlick"
               style="width:
        900px">
          <company-list v-for="companyList in data.companyList[currentTab]"
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
    <div class="section">
      <div v-if="currentSelect">
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
  import contentNav from '../../contentNav/contentNav.vue'
  import dateList from './dateList/dateList.vue'

  export default {
    data() {
      return {
        data: {   //核心推荐静态数据， 后期需要通过ajax 获取数据
          conclusions: [
            '结论111111111111111',
            '结论2222222222222222222',
            '结论333333333333333333333333333333',
            '结论444444444444444444444444444444444444'
          ],
          menu: [
            { key: 'general', name: '综合' },
            {
              key: 'social', name: '社会', subMenu: [
              {
                key: 'social__house',
                name: '房价',
              },
              {
                key: 'social__env',
                name: '环境',
              },
              {
                key: 'social__food',
                name: '食品安全',
              }
            ]
            },
            { key: 'entertainment', name: '娱乐' },
            { key: 'car', name: '汽车' },
            { key: 'technical', name: '科技' },
          ],
          companyList: {
            'general': [
              {
                team: 'ZZZ团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标12312321321312321312321321题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC、EEEE、FFFF、GGGG',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD、DDDD、EEEE、ZXY'
                  },
                  {
                    title: '这是标题标题标题这是是标题标题标题',
                    date: '9月3日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD、EEEE、FFFF、GGGG'
                  },
                  {
                    title: '这是标题标题标题这是是标题标题标题',
                    date: '9月1日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  }
                ]
              },
              {
                team: 'ZZZZ团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月3日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  }
                ]
              },
              {
                team: 'ZZZZZZ团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                ]
              },
              {
                team: 'ZZZZZZZZZ团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月3日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  }
                ]
              },
              {
                team: 'ZZZZZZZZZZ团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月3日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  }
                ]
              }
            ],
            'social': [
              {
                team: 'ZZZsocial团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD',
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是是标题标题标题',
                    date: '9月3日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是是标题标题标题',
                    date: '9月1日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  }
                ]
              },
              {
                team: 'ZZZZsocial团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月3日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  }
                ]
              },
              {
                team: 'ZZZZZZsocial团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                ]
              },
              {
                team: 'ZZZZZZZZZsocial团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月3日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  }
                ]
              },
              {
                team: 'ZZZZZZZZZZsocial团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月3日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  }
                ]
              }
            ],
            'entertainment': [
              {
                team: 'ZZZentertainment团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是是标题标题标题',
                    date: '9月3日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是是标题标题标题',
                    date: '9月1日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  }
                ]
              },
              {
                team: 'ZZZZentertainment团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月3日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  }
                ]
              },
              {
                team: 'ZZZZZZentertainment团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                ]
              },
              {
                team: 'ZZZZZZZZZentertainment团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月3日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  }
                ]
              },
              {
                team: 'ZZZZZZZZZZentertainment团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月3日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  }
                ]
              }
            ],
            'car': [
              {
                team: 'ZZZcar团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是是标题标题标题',
                    date: '9月3日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是是标题标题标题',
                    date: '9月1日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  }
                ]
              },
              {
                team: 'ZZZcarZ团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月3日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  }
                ]
              },
              {
                team: 'ZZZZZcarZ团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                ]
              },
              {
                team: 'ZZZZZcarZZZZ团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月3日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  }
                ]
              },
              {
                team: 'ZZZZZZZZZZ团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月3日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  }
                ]
              }
            ],
            'technical': [
              {
                team: 'ZZZ团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是是标题标题标题',
                    date: '9月3日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是是标题标题标题',
                    date: '9月1日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  }
                ]
              },
              {
                team: 'ZZZZ团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月3日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  }
                ]
              },
              {
                team: 'ZZZZZZ团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                ]
              },
              {
                team: 'ZZZZZZZZZ团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月3日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  }
                ]
              },
              {
                team: 'ZZZZZZZZZZ团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月3日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  }
                ]
              }
            ],
            'social__house': [
              {
                team: 'ZZZsocial__house团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是是标题标题标题',
                    date: '9月3日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是是标题标题标题',
                    date: '9月1日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  }
                ]
              },
              {
                team: 'ZZZZsocial__house团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月3日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  }
                ]
              },
              {
                team: 'ZZZZZZ团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                ]
              },
              {
                team: 'ZZZZZZZZZ团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月3日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  }
                ]
              },
              {
                team: 'ZZZZZZZZZZ团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月3日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  }
                ]
              }
            ],
            'social__env': [
              {
                team: 'ZZsocial__envZ团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是是标题标题标题',
                    date: '9月3日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是是标题标题标题',
                    date: '9月1日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  }
                ]
              },
              {
                team: 'ZZZZsocial__env团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月3日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  }
                ]
              },
              {
                team: 'ZZZZZZsocial__env团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                ]
              },
              {
                team: 'ZZZZZZZZZsocial__env团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月3日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  }
                ]
              },
              {
                team: 'ZZZZZZZZZZsocial__env团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月3日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  }
                ]
              }
            ],
            'social__food': [
              {
                team: 'ZZZsocial__food团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是是标题标题标题',
                    date: '9月3日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是是标题标题标题',
                    date: '9月1日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  }
                ]
              },
              {
                team: 'ZZZZsocial__food团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月3日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  }
                ]
              },
              {
                team: 'ZZZZZZsocial__food团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                ]
              },
              {
                team: 'ZZZZZZZZZsocial__food团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月3日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  }
                ]
              },
              {
                team: 'ZZZZZZZZZZ团队',
                group: 'XX公司YY组',
                item: [
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月5日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题',
                    date: '9月4日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  },
                  {
                    title: '这是标题标题标题这是标题标题标题这是标题标题标题',
                    date: '9月3日',
                    plus: 'AAAA、BBBB、CCCC',
                    minus: 'DDDD'
                  }
                ]
              }
            ]
          },
          dateList: [
            {
              date: '9月1日',
              items: [
                'AAAA',
                'BBBB',
                'CCCC',
                'DDDD',
                'EEEE',
              ]
            },
            {
              date: '9月3日',
              items: [
                'AAAA',
                'BBBB',
                'DDDD',
                'FFFF',
              ]
            },
            {
              date: '9月7日',
              items: [
                'AAAA',
                'BBBB',
                'DDDD',
                'FFFF',
                'GGGG',
              ]
            },
            {
              date: '9月10日',
              items: [
                'BBBB',
                'DDDD',
                'FFFF',
                'GGGG',
                'CCCC',
              ]
            },
            {
              date: '9月15日',
              items: [
                'BBBB',
                'DDDD',
                'FFFF',
                'GGGG',
                'CCCC',
              ]
            },
            {
              date: '9月16日',
              items: [
                'AAAA',
                'BBBB',
                'CCCC',
              ]
            },
            {
              date: '9月22日',
              items: [
                'QQQQ',
                'CCCC',
              ]
            },
          ]
        },
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
        currentTab: 'general',
        currentSelect: null,
        currentSelectDateItem: null,
        companySlickLeftDisable: true,
        companySlickRightDisable: false,
        slickLeftDisable: true,
        slickRightDisable: false,
      }
    },
    methods: {
      switchTab(tab) {
        this.currentTab = tab.key
        //在这里获取后台数据
        this.$refs.companySlick.reSlick()
        this.companySlickLeftDisable = true
        this.companySlickRightDisable = false
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
        this.companySlickRightDisable = slide >= this.data.companyList[this.currentTab].length - 3
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
      contentNav,
      dateList
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
