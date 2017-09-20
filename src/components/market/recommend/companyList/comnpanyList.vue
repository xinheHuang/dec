<template>
  <div style="width:200px;padding: 16px 50px 0">
    <div class="key"
         v-tooltip.right="{content:toolTipText}"
         @click="$emit('companySelect',companyList)"
         :class="{'selected':selected}"
    >
      <div>
        {{companyList.group}}
      </div>
    </div>

    <div class="items">
      <div v-for="(article,index) in companyList.articles"
           class="item">
        <div class="item-title"
             @click="openModal(article)">
          <p ref="title">
            {{ `${dateFormat(article.date)}：${article.title}`}}
          </p></div>
        <div class="divider"
             style="margin: 0 10px"></div>
        <div>
          <div style="display: flex;align-items: center">
            <span class="iconplus icon-plus-circle">     </span>
            <span style="margin-left: 20px;flex-grow: 1;word-break: break-all" ref="title">
              {{getDiffRecommends(article,index).plus}}
            </span>
          </div>

          <div style="display: flex;align-items: center">
            <span class="iconplus icon-minus-circle">     </span>
            <p style="margin-left: 20px;flex-grow: 1;word-break: break-all" ref="title">
             {{getDiffRecommends(article,index).minus}}
            </p>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import '../../../../assets/font/plus/style.css'
  import EventBus from '../../../../eventBus'
  import { dateFormat, dotString } from '../../../../utils'
  import '../../../../utils/clamp.min'
  import VTooltip from 'v-tooltip'

  Vue.use(VTooltip)
  export default {
    props: {
      companyList: {
        type: Object,
        required: true,
      },
      selected: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      toolTipText() {
        console.log(this.companyList.people)
        return `<div style="display: flex;justify-content: space-around;align-items: center">
          <div style="text-align: center; margin:10px;padding-right: 10px;
          border-right: solid 1px
          black">
          ${this.companyList.people.reduce(
          (prev, people) => `${prev}<div style="height: 30px;line-height: 30px;vertical-align: middle">${people.name}</div>`,
          '')}
          </div>

          <div style=" margin:10px;">
         ${this.companyList.people.reduce(
          (prev, people) =>
            `${prev}<div style="height: 30px;line-height: 30px;vertical-align: middle">${people.mobile}</div>`,
          '')}
        </div>

          </div>`
      },
    },
    methods: {
      dateFormat,
      openModal(article) {  //文章弹窗
        EventBus.$emit('articleModal', article)
      },
      getDiffRecommends: function (article, index) {
        const currentSet = new Set(article.recommends.map((recommend) => recommend.recommend))
        const prevSet = index === this.companyList.articles.length - 1 ? new Set() : new Set(this.companyList.articles[index + 1].recommends.map((recommend) => recommend.recommend))
        return {
          plus: [...currentSet].filter(x => !prevSet.has(x)).reduce((prev,x)=> `${prev}${prev && ','}${x}`,''),
          minus: [...prevSet].filter(x => !currentSet.has(x)).reduce((prev,x)=> `${prev}${prev && ','}${x}`,'')
        }
      }
    },
    mounted() {
//      console.log(this.$refs.title)
      this.$refs.title.forEach((el) => {
        $clamp(el, { clamp: 2 })
      })
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .iconplus {
    padding: 10px;
    color: #6b6868;
    font-size: 20px
  }

  .key {
    text-align: center;
    background: #e2dddd;
    padding: 10px 0;
    margin-bottom: 20px;
    cursor: pointer;
  }

  .key.selected {
    background: #2c8abf;
    color: white;
  }

  .item {
    border: 2px solid #e2dddd;
    margin-top: 10px;
    padding: 10px;
    font-size: 14px;
  }

  .item-title {
    line-height: 25px;
    cursor: pointer;
    margin-bottom: 10px;
    word-break: break-all;
  }

  .item-detail > * {
    width: 50px;
    margin-top: 10px;
    text-align: center;
    font-size: 14px;
    line-height: 14px;
    vertical-align: middle;
  }

  .item-detail .icon {
    color: #e2dddd;

  }


</style>
