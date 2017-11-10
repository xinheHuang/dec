<template>
  <div id="graph">
    <div class="top-op"
         v-if="editMode">
      <div style="display: flex;align-items: center">
        <img :src="require('../../assets/images/samelevelnode.png')" />
        <span @click="addParallelNode()">
          加入同级节点
        </span>
        <img :src="require('../../assets/images/nextlevelnode.png')" />
        <span @click="addChildNode()">
          加入下级节点
        </span>
        <span @click="removeNode()">
          删除节点
        </span>
        <img :src="require('../../assets/images/shownodes.png')" />
        <select v-model="selected"
                @change="selectChange()">
          <option disabled
                  value="">展开
          </option>
          <option :value="index+1"
                  v-for="(v,index) in Array(7)">展开到{{numberZh[index + 1]}}级节点
          </option>
        </select>
      </div>
      <div class="save-op">
        <span @click="saveDraft()"
              :class="{disabled:isSaving}">
          保存{{isSaving ? '中...' : ''}}
        </span>
        <span @click="saveFinal()"
              v-tooltip.bottom="{content:'将此版图谱记录为历史版本'}">
          提交
        </span>
      </div>
    </div>
    <div style="position: relative">
      <transition name="fade">
        <div class="save-tip"
             v-show="showFailedTip"
        >
          <icon name="exclamation-triangle"
                style="color:red" />
          <span style="margin-left: 10px">{{tipType}}失败!</span>
        </div>
      </transition>

      <transition name="fade">
        <div class="save-tip"
             v-show="showSuccessTip"
        >
          <icon name="check-circle"
                style="color:limegreen" />
          <span style="margin-left: 10px">{{tipType}}成功!</span>
        </div>
      </transition>

      <div class="jsmind-container"
           @click="handleClick"></div>
      <div v-if="jm"
           class="left-op"
      >
        <!--{{currentZoom}}-->
        <img :src="require('Asset/images/plus.png')"
             v-button
             @click="zoomIn()" />
        <input type="range"
               style="-webkit-appearance: slider-vertical;writing-mode: bt-lr"
               :min="jm.view.minZoom"
               :max="jm.view.maxZoom"
               orient="vertical"
               :step="jm.view.zoomStep"
               @change="changeZoom()"
               v-model="currentZoom" />
        <img :src="require('Asset/images/minus.png' )"
             v-button
             @click="zoomOut()" />
        <img :src="require('Asset/images/drag.png')"
             :class="{'selected':isDrag}"
             @click="toggleDrag" />
        <img :src="require('Asset/images/position.png')"
             v-button
             @click="goCenter()"
        />
        <img :src="require('Asset/images/eye.png')"
             :class="{'selected':showThumb}"
             @click="showThumbnail" />
      </div>
      <div class="thumbnail"
           v-show="showThumb && thumbSrc">
        <img :src="thumbSrc"
             width="auto"
             height="100%">
      </div>
    </div>

  </div>
</template>

<script>
  import Vue from 'vue'
  import jsMind from 'jsmind'
  import 'jsmind/style/jsmind.css'
  //  import VTooltip from 'v-tooltip'
  import { numberZh } from '../../utils/index'
  import EventBus from '@/eventBus'
  import domtoimage from 'dom-to-image'

    export default {
    props: {
      editMode: Boolean,
      nodes: Array,
      graphInfo: Object,
      onSaveDraft: Function,
      onSaveFinal: Function,
    },
    data() {
      return {
        thumbSrc: null,
        jsMindContainer: null,
        jm: null,
        zoomOutDisabled: false,
        zoomInDisabled: false,
        currentZoom: 1,
        maxZoom: 2,
        minZoom: 0.5,
        zoomStep: 0.1,
        selected: '',
        currX: 0,
        currY: 0,
        showThumb: false,
        isDrag: false,
        numberZh,

        timeout: null,
        isSaving: false,
        centerTimeOut: null,

        showSuccessTip: false,
        showFailedTip: false,
        tipType: '',
      }
    },
    computed: {
      graphNodes() {
        return this.nodes.map(({ title, parentNodeId, direction, nodeId, graphNodeId }) => ({
          graphNodeId,
          id: nodeId,
          isroot: parentNodeId == 0,
          parentid: parentNodeId,
          topic: title,
          direction
        }))
      }
    },
    methods: {
      async saveFinal() {
        try {
          const name = await this.swal({
            text: '是否要将此版图谱归档为历史版本，方便您后续回溯？',
            title: '提交图谱',
            content: {
              element: 'input',
              attributes: {
                placeholder: '请输入图谱名称',
              }
            },
            buttons: {
              cancel: {
                text: '取消',
                visible: true,
              },
              confirm: {
                text: '提交',
                visible: true,
                closeModal: false,
              },
            },
          })
          console.log('graph name', name)
          if (name !== null) {
            if (name) {
              const nodes = this.getCurrentNodes()
              const suc = await this.save('提交', async () => {
                return await this.onSaveFinal(nodes, name)
              })
              if (suc) {
                this.swal({
                  text: '已成功归档，您可以在 XXX 处回溯查阅。',
                  title: '提交成功',
                  icon: 'success',
                })
              }
            } else {
              EventBus.$emit('errorDialog', { text: '请输入图谱名称', callback: this.saveFinal })
            }
          }
        }
        catch (error) {
          this.swal.stopLoading()
          EventBus.$emit('errorDialog', { title: '提交失败!', text: error.message })
        }
      },
      saveDraft() {
        const nodes = this.getCurrentNodes()
        try {
          this.save('保存', async () => {
            return await this.onSaveDraft(nodes)
          })
        } catch (error) {

        }
      },
      getCurrentNodes() {
        return Object.keys(this.jm.mind.nodes)
          .map((id) => {
            const node = this.jm.mind.nodes[id]
            return {
              nodeId: id,
              title: node.topic,
              direction: node.direction == -1 ? 'left' : 'right',
              graphId: this.id,
              parentNodeId: node.isroot ? 0 : node.parent.id
            }
          })
      },


      async save(tipType, saveCallback) {
        this.isSaving = true
        this.tipType = tipType
        try {
          const res = await saveCallback()
          this.showSuccessTip = true
          return true
        }
        catch (error) {
          this.showFailedTip = true
          throw error
        }
        finally {
          if (this.timeout) {
            clearTimeout(this.timeout)
          }
          this.isSaving = false
          this.timeout = setTimeout(() => {
            this.showSuccessTip = false
            this.showFailedTip = false
            this.timeout = null
          }, 2000)
        }
      },
      goCenter() {
        if (this.centerTimeOut) return
        const inner = this.jsMindContainer.find('.jsmind-inner')
          .children()

        const originTransform = inner[0].style.transform
        inner.addClass('animation')
        inner.css(
          'transform', `translate(0px, 0px)` + originTransform.replace(/translate\(.*?\)/, ''))
        this.centerTimeOut = setTimeout(() => {
          this.updateThumbnail()
          inner.removeClass('animation')
          this.centerTimeOut = null
          this.currX = 0
          this.currY = 0
        }, 500)
      },

      toggleDrag() {
        this.isDrag = !this.isDrag
        const inner = this.jsMindContainer.find('.jsmind-inner')
        if (this.isDrag) {
          let startDrag = false
          let startX, startY
          let originTransform
          inner.mousedown((event) => {
            startDrag = true
            startX = this.currX - event.clientX
            startY = this.currY - event.clientY
            originTransform = inner.children('canvas')[0].style.transform
          })
          inner.mousemove((event) => {
            if (startDrag) {
              inner.children()
                .css(
                  'transform', `translate(${ event.clientX + startX}px,${ event.clientY + startY}px)` + originTransform.replace(
                  /translate\(.*?\)/, ''))
            }
          })
          inner.mouseup((event) => {
            console.log('stop drag')
            startDrag = false
            this.currX = +event.clientX + startX
            this.currY = +event.clientY + startY
            this.updateThumbnail()
          })
        }
        else {
          inner.unbind()
        }
      },
      handleClick() {
        this.updateThumbnail()
      },
      showThumbnail() {
        this.showThumb = !this.showThumb
        if (this.showThumb)
          this.updateThumbnail()
        else
          this.thumbSrc = null
      },
      updateThumbnail() {
        if (this.showThumb) {
          domtoimage.toPng(this.jsMindContainer[0])
            .then((dataUrl) => {
              this.thumbSrc = dataUrl
            })
            .catch(function (error) {
              console.error('oops, something went wrong!', error)
            })
        }
      },
      removeNode() {
        const selected_node = this.jm.get_selected_node()
        if (!selected_node) {
          alert('请先选择一个节点')
          return
        }
        this.jm.remove_node(selected_node)
        this.updateThumbnail()
      },
      selectChange() {
        console.log(this.selected)
        this.jm.expand_to_depth(this.selected)
        this.updateThumbnail()
      },
      changeZoom() {
        this.jm.view.setZoom(+this.currentZoom)
        this.updateThumbnail()
      },
      zoomIn() {
        this.jm.view.zoomIn()
        this.currentZoom = +this.jm.view.actualZoom
        this.updateThumbnail()
      },
      zoomOut() {
        this.jm.view.zoomOut()
        this.currentZoom = +this.jm.view.actualZoom
        this.updateThumbnail()
      },
      addChildNode() {
        const selected_node = this.jm.get_selected_node()
        if (!selected_node) {
          alert('请先选择一个节点')
          return
        }
        const nodeid = jsMind.util.uuid.newid()
        const node = this.jm.add_node(selected_node, nodeid, '子节点')
        this.updateThumbnail()
      },
      addParallelNode() {
        const selected_node = this.jm.get_selected_node()
        if (!selected_node) {
          alert('请先选择一个节点')
          return
        }

        if (!selected_node.parent) {
          alert('根节点不能添加平行节点')
          return
        }
        const nodeid = jsMind.util.uuid.newid()
        const node = this.jm.add_node(selected_node.parent, nodeid, '相邻节点')
        this.updateThumbnail()
      },
      showGraph(nodes) {
        console.log('showGraph', nodes)
        const mind = {
          'meta': this.graphInfo,
          'format': 'node_array',
          'data': nodes
        }
        this.jm.show(mind)
        const scale=this.jsMindContainer.width()/this.jsMindContainer.find('canvas').width()
        if (scale<1) {
          this.currentZoom = Math.floor(scale*10)/10;
          console.log(scale,this.currentZoom);
          this.changeZoom();
        }

      }
    },
    watch: {
      graphNodes(newNode, old,) {
        console.log('node change', newNode)
        this.showGraph(newNode)
      }
    },
    mounted() {
    console.log('graph info ',this.graphInfo)
      this.jsMindContainer = $(this.$el)
        .find('.jsmind-container')
      console.log(this.jsMindContainer)
      const options = {
        container: this.jsMindContainer[0],
        editable: true,
        theme: 'primary',
        shortcut: {
          enable: false
        }
      }
      this.jm = new jsMind(options)

      this.showGraph(this.graphNodes)
      this.updateThumbnail()

      const _this = this
      //fixed some jsmind features
      this.jm.begin_edit = function (node) {
        if (!jsMind.util.is_node(node)) {
          var the_node = this.get_node(node)
          if (!the_node) {
            logger.error('the node[id=' + node + '] can not be found.')
            return false
          } else {
            return this.begin_edit(the_node)
          }
        }
        if (this.get_editable()) {
          console.log(node, _this.editMode)
          EventBus.$emit('openModal', 'node-modal', {
            node: {
              id: node.id,
              topic: node.topic,
              graphNodeId: node.data.graphNodeId
            },
            editMode: _this.editMode,
            jm:_this.jm
          })
        } else {
          logger.error('fail, this mind map is not editable.')
          return
        }
      }
      this.jm.view.setZoom = function (zoom) {
        console.log(zoom)
        if ((zoom < this.minZoom - 0.0001) || (zoom > this.maxZoom + 0.0001)) {
          return false
        }
        console.log('set ', zoom)
        this.actualZoom = zoom
        for (var i = 0; i < this.e_panel.children.length; i++) {
          const transform = this.e_panel.children[i].style.transform
//          console.log(transform.replace(/scale\(.*?\)/, '') + `scale(${zoom})`)
          this.e_panel.children[i].style.transform = transform.replace(/scale\(.*?\)/, '') + `scale(${zoom})`
        }

        this.show(true)
        return true

      }

      //handle event from
      EventBus.$on('nodeModalClose', (editNode,jm) => {
        console.log(jm)
        if (jm===this.jm)
          this.jm.update_node(editNode.id, editNode.topic)
      })

//      this.jsMindContainer = $(this.$el).find('.jsmind-container')
    },
    beforeDestroy() {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }

      if (this.centerTimeOut) {
        clearTimeout(this.centerTimeOut)
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  #graph {
    .jsmind-container {
      width: 100%;
      height: 600px;
      border: solid 1px #ccc;
      background: #f4f4f4;
      overflow: hidden;
      .jsmind-inner {
        overflow: hidden;
        > * {
          &.animation {
            transition: transform 0.5s;
          }
        }
      }
    }

    .top-op {
      display: flex;
      background: #efefef;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      /*position: relative;*/
      img {
        margin-right: 10px;
      }
      select {
        font-size: 16px;
        text-align: center;
      }
      span {
        display: inline-block;
        padding: 5px;
        cursor: pointer;
        margin: 5px;
      }
      .save-op {
        span {
          &:hover {
            background: #ccc;
            border: 0px solid #ccc;
            border-radius: 5px;
          }
          &.disabled {
            cursor: not-allowed;
          }
        }
      }
    }

    .save-tip {
      align-items: center;
      display: flex;
      position: absolute;
      top: 5px;
      padding: 5px;
      right: 10px;
      border: 1px solid #ccc;
      background: white;
    }

    .left-op {
      position: absolute;
      bottom: 30px;
      left: 10px;
      z-index: 9996;
      display: flex;
      flex-direction: column;
      align-items: center;
      span {
        color: #ccc;
      }
      input {
        width: 20px;
      }
      img, .icon {
        width: 30px;
        padding: 5px;
        opacity: 0.4;
        &.selected {
          opacity: 1;
        }
        > * {
          width: 30px;
          height: 30px;
          color: #727272;
        }
      }
    }

    .thumbnail {
      position: absolute;
      bottom: 35px;
      left: 60px;
      height: 90px;
      border: 1px solid #ccc;
      /*display: none;*/
    }
  }

</style>
