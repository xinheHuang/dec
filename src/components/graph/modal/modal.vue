<!--node弹窗-->
<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <div class="close">
              <a class="icon-close icon-circle-with-cross"
                 @click="$emit('close')"></a>
            </div>
            <div style="text-align: center;position: relative">
              <h3 style="color:black;"
                  @dblclick="   editTopic=true;        tempTopic=node.topic"
                  v-show="!editTopic">
                {{node.topic}}
              </h3>
              <div v-show="editTopic"
                   class="edit-topic">
                <input v-model="tempTopic">
                <div class="icon"
                     @click="saveTopic()"
                     v-button>
                  <icon name="save"/>
                </div>
              </div>
              <div style="position: absolute;top: 0;right: 50px;">
                <transition name="fade">
                  <div v-show="tipShown "
                       style="display: flex;align-items: center">
                    <icon v-if="tipType=='succ'"
                          name="check-circle"
                          style="color:limegreen"/>
                    <icon v-if="tipType=='error'"
                          name="close"
                          style="color:red"/>
                    <span style="margin-left: 20px">{{saveText}}</span>
                  </div>
                </transition>
                <div v-show="isSaving">
                  <span>{{savingText}}</span>
                </div>
              </div>
            </div>
            <!--<div class="divider"></div>-->
          </div>

          <div class="modal-body">
            <content-nav :menus="menu"
                         :enableSearch="false"
                         @switchTab="tabChanged"></content-nav>
            <component :is="currentTab"
                       :node="node"
                       :saving="saving"
                       :saveFailed="saveFailed"
                       :saved="saved"></component>
          </div>

        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import '../../../assets/font/calendar/style.css'
  import '../../../assets/font/close/style.css'
  import contentNav from 'Component/contentNav/contentNav.vue'
  import comment from './comment.vue'
  import indicator from './indicator.vue'
  import {dateFormat} from 'Util'
  import 'vue-awesome/icons/save'
  import 'vue-awesome/icons/close'
  import 'vue-awesome/icons/check-circle'

  export default {
    props: {
      node: {  //弹窗node
        type: Object,
        required: true,
      }
    },
    data() {
      return {
        menu: [
          {
            key: 'comment',
            name: '关联点评'
          },
          {
            key: 'indicator',
            name: '关联指标'
          },
        ],
        editTopic: true,
        tempTopic: this.node.topic,
        tipShown: false,
        timeout: null,
        currentTab: null,
        saveText: null,
        isSaving: false,
        savingText: null,
        tipType: null,
      }
    },
    methods: {
      tabChanged(menu) {
        this.currentTab = menu.key
      },
      dateFormat,
      showTip(text) {
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        this.tipShown = true
        this.saveText = text
        this.timeout = setTimeout(() => {
          this.tipShown = false
//          this.tipType = null
          this.timeout = null
        }, 2000)
      },
      saving(text) {
        this.savingText = text
        this.isSaving = true
      },
      saved(text) {
        this.isSaving = false
        if (!text) {
          return
        }
        this.tipType = 'succ'
        this.showTip(text)
      },
      saveFailed(text) {
        this.tipType = 'error'
        this.showTip(text)
      },
      saveTopic() {
        if (this.tempTopic) {
          this.node.topic = this.tempTopic
          this.editTopic = false
          this.saved('修改成功')
        }
        else {
          this.saveFailed('topic不能为空')
        }
      }

    },
    beforeDestroy() {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
    },
    components: {
      contentNav,
      comment,
      indicator,
    },

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less"
       scoped>

  .edit-topic {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
    > input {
      font-size: 16px;
      margin-right: 15px
    }
    .icon {
      > * {
        height: 20px;
        width: auto;
        color: #ccc;
      }
      &.selected {
        > * {
          color: black;
        }
      }
    }
  }


</style>
