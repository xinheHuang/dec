<template>
  <div>
    <textarea id="editor"
              style="width: 90%"
              placeholder="输入笔记内容..."
              autofocus></textarea>
    <div style="display: flex;flex-direction: row-reverse">
      <span style="padding: 10px;color: #2c8abf;cursor: pointer;"
            @click="save()"
            v-show="!saving">发表评论</span>
      <span style="padding: 10px;color: #2c8abf;"
            v-show="saving">发表中...</span>
    </div>
    <div class="divider"></div>
    <div style="display: flex;justify-content: space-between;padding: 10px;align-items: center">
      <span>历史点评</span>
      <div>
        <input type="radio"
               id="all"
               value="all"
               v-model="picked" />
        <label for="all">全部</label>
        <input type="radio"
               id="company"
               value="company"
               v-model="picked" />
        <label for="company">只显示本公司</label>
        <input type="radio"
               id="me"
               value="me"
               v-model="picked" />
        <label for="me">只显示自己</label>
      </div>
    </div>

    <div class="comments">
      <div v-for="comment in shownComments"
           style="display: flex;">
        <span style="width: 100px">{{getTime(comment.riqi)}}</span>
        <span style="width: 100px">{{comment.institution}}</span>
        <span style="width: 100px">{{comment.author}}</span>
        <div style="word-break: break-all" v-html="comment.content"></div>
      </div>
      <div style="text-align: center;margin-top: 10px;color:gray">
      <span v-show="hasMore"
            style="cursor: pointer"
            @click="loadMore()">加载更多</span>
        <div v-show="!hasMore">暂无更多</div>
      </div>
    </div>
  </div>
</template>
<script>
  import Simditor from 'simditor'
  import 'simditor/styles/simditor.css'
  import {twoDigitNumber} from '../../../utils'

  export default {
    props: {
      node: Object,
      saved: Function,
    },
    data() {
      return {
        editor: null,
        saving: false,
        picked: 'all',
        hasMore: false,
        comments: [],
        currentFrom: 0,
      }
    },
    mounted() {
      this.editor = new Simditor({
        textarea: $('#editor')
        //optional options
      })
      this.loadMore()
    },
    computed:{
      shownComments(){
        return this.comments.filter(()=>{return true}) //todo me ,comment
      }
    },
    methods: {
      loadMore() {
        this.$http.get(`/api/graph/node/${this.node.id}/comment/${this.currentFrom}`)
          .then((res) => {
            this.comments = [...this.comments, ...res.data.comments]
            this.hasMore = res.data.hasMore
            this.currentFrom = this.comments.length
          })
      },
      getTime(riqi){
        const date=new Date(riqi);
        return `${twoDigitNumber(date.getHours())}：${twoDigitNumber(date.getMinutes())}`
      },
      save() {
        if (this.editor) {
          this.saving = true
          this.$http.post(`/api/graph/node/${this.node.id}/comment`, {
            author: 'author',  //todo
            institution: 'institution',
            content: this.editor.getValue()
          })
            .then((res) => {
              this.saved()
              this.comments.unshift(res.data);
              this.saving = false
            })
        }
      }
    }
  }
</script>
<style lang="less">

  .simditor .simditor-body {
    min-height: 200px;
    /*min-width: 90%*/
  }

  .comments{
    span{
      flex-shrink: 0;
      flex-grow: 0;
    }
  }
</style>
