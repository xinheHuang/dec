<template>
  <div>
    <!--结论部分-->
    <div class="section">
      <conclusion :conclusions="data.conclusions"></conclusion>
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
              @click="onLeft"></span>

        <transition-group tag="div"
                          name="list"
                          class="items">
          <key-word-list :key="keyWordList.key"
                         v-for="keyWordList in shownList"
                         class="list-item"
                         :keyWordList="keyWordList"></key-word-list>
        </transition-group>

        <span class="icon-angle icon-angle-right"
              @click="onRight"></span>
      </div>
    </div>
  </div>
</template>

<script>
  import conclusion from '../conclusion/conclusion.vue'
  import keyWordList from '../keyWordList/keyWordList.vue'

  export default {
    data() {
      return {
        data: {   //关注热点静态数据， 后期需要通过ajax 获取数据
          conclusions: [
            '结论111111111111111',
            '结论2222222222222222222',
            '结论333333333333333333333333333333',
            '结论444444444444444444444444444444444444'
          ],
          chartTypes: [
            '全部', '科技', '消费', '周期', '能源', '金融',
          ],
          keyWordLists: [
            {
              key: 'XXXX',
              readNumber: 2585,
              items: [
                {
                  title: '这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题',
                  date: '9月5日',
                  readNumber: 2239,
                  like: 34
                },
                {
                  title: '这标题',
                  date: '9月5日',
                  readNumber: 2239,
                  like: 34
                },
                {
                  title: '这是标题标题',
                  date: '9月5日',
                  readNumber: 2239,
                  like: 34
                }
              ]
            },
            {
              key: 'YYYY',
              readNumber: 2585,
              items: [
                {
                  title: '这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题',
                  date: '9月5日',
                  readNumber: 2239,
                  like: 34
                },
                {
                  title: '这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题',
                  date: '9月5日',
                  readNumber: 2239,
                  like: 34
                },
                {
                  title: '这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题',
                  date: '9月5日',
                  readNumber: 2239,
                  like: 34
                }
              ]
            },
            {
              key: 'ZZZZ',
              readNumber: 2585,
              items: [
                {
                  title: '这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题',
                  date: '9月5日',
                  readNumber: 2239,
                  like: 34
                },
                {
                  title: '这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题',
                  date: '9月5日',
                  readNumber: 2239,
                  like: 34
                },
                {
                  title: '这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题',
                  date: '9月5日',
                  readNumber: 2239,
                  like: 34
                }
              ]
            }, {
              key: 'AAAA',
              readNumber: 2585,
              items: [
                {
                  title: '这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题',
                  date: '9月5日',
                  readNumber: 2239,
                  like: 34
                },
                {
                  title: '这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题',
                  date: '9月5日',
                  readNumber: 2239,
                  like: 34
                },
                {
                  title: '这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题',
                  date: '9月5日',
                  readNumber: 2239,
                  like: 34
                }
              ]
            }, {
              key: 'BBBB',
              readNumber: 2585,
              items: [
                {
                  title: '这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题',
                  date: '9月5日',
                  readNumber: 2239,
                  like: 34
                },
                {
                  title: '这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题',
                  date: '9月5日',
                  readNumber: 2239,
                  like: 34
                },
                {
                  title: '这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题这是标题标题',
                  date: '9月5日',
                  readNumber: 2239,
                  like: 34
                }
              ]
            }]
        },
        selectedChartType: '全部',
        currentStartKey: 0,  //起始关键字索引
        shownList: []
      }
    },
//    computed: {
//      shownList() {
////        return this.data.keyWordLists
//        return this.data.keyWordLists.slice(this.currentStartKey, this.currentStartKey + 3)
//      }
//    },
    methods: {
      changeChartType(type) {
        this.selectedChartType = type

        //这里根据类型发起ajax 请求，刷新图表
      },
      onLeft() {  //左箭头点击
        if (this.currentStartKey > 0) {
          this.currentStartKey--
          this.shownList.pop()
          this.shownList.unshift(this.data.keyWordLists[this.currentStartKey])
        }

      },
      onRight() {  //右箭头点击
        if (this.currentStartKey + 3 < this.data.keyWordLists.length) {
          this.currentStartKey++;
          this.shownList.shift()
          this.shownList.push(this.data.keyWordLists[this.currentStartKey+2])
        }
      }
    },
    created() {
      this.currentStartKey = 0
      this.shownList = this.data.keyWordLists.slice(0, 3)
    },
    components: {
      conclusion,
      keyWordList
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .section {
    background: white;
    border: 2px solid #e2dddd;
    margin-top: 20px;
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

  .items {
    white-space: nowrap;
    /*overflow: hidden;*/
    width: 900px;
    /*transition: all 1s;*/
    /*transform: translate(-300px, 0);*/
  }

  .list-item {
    display: inline-block;
    vertical-align: top;
  }

  @keyframes slide {
    100% {
      left: 0;
    }
  }

  .icon-angle {
    cursor: pointer;
  }

  .list-move {
    transition: transform 1s;
  }
</style>
