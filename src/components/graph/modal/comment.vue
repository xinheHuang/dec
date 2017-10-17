<template>
  <div>
    <div v-if=" editMode">
      <textarea class="editor"
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
    </div>
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
        <span style="width: 200px">{{comment.industry}}</span>
        <span style="width: 100px">{{comment.author}}</span>
        <div style="word-break: break-all"
             v-html="comment.content"></div>
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
  import { twoDigitNumber } from 'Util'
  import EventBus from '@/eventBus'

  export default {
    props: {
      node: Object,
      editMode: Boolean,
      saved: Function,
      saveFailed: Function,
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
      if (this.editMode) {
        this.editor = new Simditor({
          textarea: $(this.$el)
            .find('.editor'),
          //optional options
          pasteImage: true,
          upload: {  //todo upload api
            url: '',
            params: null,
            fileKey: 'upload_file',
            connectionCount: 3,
            leaveConfirm: 'Uploading is in progress, are you sure to leave this page?'
          },
          //todo default image

        })
      }
      this.loadMore()
    },
    computed: {
      shownComments() {
        return this.comments.filter(() => {
          return true
        }) //todo me ,comment
      }
    },
    methods: {
      loadMore() {
        this.$http.get(`/api/node/${this.node.id}/comment/${this.currentFrom}`)
          .then((res) => {
            this.comments = [...this.comments, ...res.comments]
            this.hasMore = res.hasMore
            this.currentFrom = this.comments.length
          })
          .catch(({ response }) => {
            const { status } = response
            if (status == 417) {
              EventBus.$emit('errorDialog', {
                text: '请先保存图谱',
                callback() {
                  EventBus.$emit('closeModal')
                }
              })
            }
          })
      },
      getTime(riqi) {
        const date = new Date(riqi)
        return `${twoDigitNumber(date.getHours())}：${twoDigitNumber(date.getMinutes())}`
      },
      async save() {
        try {
          if (this.editor) {
            const content = this.editor.getValue()
            if (content) {
              this.saving = true
              const comment = await this.$http.post(`/api/node/${this.node.id}/comment`, {
                content
              })
              this.saved('发表成功')
              this.comments.unshift(comment)

            }
            else {  //comment empty
              this.saveFailed('评论不可为空')
            }
          }
        }
        catch (error) {
          this.saveFailed('发表失败')
        }
        finally {
          this.saving = false
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

  .comments {
    span {
      flex-shrink: 0;
      flex-grow: 0;
    }
  }
</style>
