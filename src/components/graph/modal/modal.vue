<!--node弹窗-->
<template>

  <modal @close="close()">
    <div slot="title"
         style="text-align: center;position: relative">
      <h3 style="color:black;"
          @dblclick="titleEdit()"
          v-show="!modalData.editMode || !editTopic">
        {{modalData.node.topic}}
      </h3>
      <div v-if="modalData.editMode"
           v-show="editTopic"
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
            <span style="margin-left: 20px"
                  v-html="saveText"></span>
          </div>
        </transition>
        <div v-show="isSaving">
          <span>{{savingText}}</span>
        </div>
      </div>
    </div>
    <div slot="body">
      <content-nav :menus="menu"
                   :enableSearch="false"
                   @switchTab="tabChanged"></content-nav>
      <component :is="currentTab"
                 :node="modalData.node"
                 :edit-mode="modalData.editMode"
                 :saving="saving"
                 :saveFailed="saveFailed"
                 :saved="saved"></component>
    </div>
  </modal>
</template>

<script>
  import contentNav from 'Component/contentNav/contentNav.vue'
  import Modal from 'Component/modal/modal.vue'
  import comment from './comment.vue'
  import indicator from './indicator.vue'
  import {dateFormat} from 'Util'
  import EventBus from '@/eventBus'

  export default {
    props: {
      modalData: {  //弹窗node
        type: Object,
        required: true,
      },
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
        tempTopic: this.modalData.node.topic,
        tipShown: false,
        timeout: null,
        currentTab: null,
        saveText: "",
        isSaving: false,
        savingText: null,
        tipType: null,
      }
    },
    methods: {
      titleEdit() {
        if (this.modalData.editMode) {
          this.editTopic = true
          this.tempTopic = this.modalData.node.topic
        }
      },
      close() {
        EventBus.$emit('closeModal', (modalData) => {
          console.log(modalData)
          EventBus.$emit('nodeModalClose', modalData.node,modalData.jm)
        })
      },
      tabChanged(menu) {
        this.currentTab = menu.key
      },
      dateFormat,
      showTip(text) { //完成
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
        console.log('text', text)
        this.showTip(text)
      },
      saveFailed(text) {
        this.isSaving = false
        this.tipType = 'error'
        this.showTip(text)
      },
      saveTopic() {
        if (this.tempTopic) {
          this.modalData.node.topic = this.tempTopic
          this.editTopic = false
          this.saved('修改成功')
        }
        else {
          this.saveFailed('topic不能为空')
        }
      }

    },
    mounted() {
      console.log(this.modalData)
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
      Modal,
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
