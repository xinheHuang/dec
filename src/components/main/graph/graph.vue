<template>
  <div id="graph">
    <div class="top-op">
      <div style="display: flex;align-items: center">
        <img :src="require('../../../assets/images/samelevelnode.png')"/>
        <span @click="addParallelNode()">
          加入同级节点
        </span>
        <img :src="require('../../../assets/images/nextlevelnode.png')"/>
        <span @click="addChildNode()">
          加入下级节点
        </span>
        <span @click="removeNode()">
          删除节点
        </span>
        <img :src="require('../../../assets/images/shownodes.png')"/>
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
        <span @click="save()"
              :class="{disabled:isSaving}">
          保存{{isSaving ? '中...' : ''}}
        </span>
        <span @click="submit()"
              v-tooltip.bottom="{content:'将此版图谱记录为历史版本'}">
          提交
        </span>
      </div>
    </div>
    <div style="position: relative">
      <transition name="fade">
        <div class="save-tip"
             v-show="showSuccessTip"
        >
          <icon name="check-circle"
                style="color:limegreen"/>
          <span style="margin-left: 10px">保存成功!</span>
        </div>
      </transition>

      <div id="jsmind_container"
           @click="handleClick"></div>
      <div v-if="jm"
           class="left-op"
      >
        <!--{{currentZoom}}-->
        <img :src="require('../../../assets/images/plus.png')"
             v-button
             @click="zoomIn()"/>
        <input type="range"
               style="-webkit-appearance: slider-vertical;writing-mode: bt-lr"
               :min="jm.view.minZoom"
               :max="jm.view.maxZoom"
               orient="vertical"
               :step="jm.view.zoomStep"
               @change="changeZoom()"
               v-model="currentZoom"/>
        <img :src="require('../../../assets/images/minus.png' )"
             v-button
             @click="zoomOut()"/>
        <img :src="require('../../../assets/images/drag.png')"
             :class="{'selected':isDrag}"
             @click="toggleDrag"/>
        <!--<div class="icon" v-button @click="goCenter()">-->
        <!--<icon name="target" />-->
        <!--</div>-->
        <img :src="require('../../../assets/images/position.png')"
             v-button
             @click="goCenter()"
        />
        <img :src="require('../../../assets/images/eye.png')"
             :class="{'selected':showThumb}"
             @click="showThumbnail"/>
      </div>
      <div class="thumbnail"
           v-show="showThumb">
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
  import VTooltip from 'v-tooltip'
  import {numberZh} from '../../../utils/index'
  import '../../../assets/js/html2canvas'
  import '../../../assets/js/jquery-ui-1.12.1.custom/jquery-ui.min'
  import EventBus from '../../../eventBus'

  import Icon from 'vue-awesome/components/Icon.vue'
  import 'vue-awesome/icons/check-circle'

  Icon.register(
    {
      target: {
        width: 32,
        height: 32,
        d: "M32 14h-3.154c-0.864-5.57-5.276-9.982-10.846-10.846v-3.154h-4v3.154c-5.57 0.864-9.982 5.276-10.846 10.846h-3.154v4h3.154c0.864 5.57 5.276 9.982 10.846 10.846v3.154h4v-3.154c5.57-0.864 9.982-5.276 10.846-10.846h3.154v-4zM24.776 14h-3.118c-0.603-1.705-1.953-3.056-3.658-3.658v-3.118c3.36 0.765 6.010 3.416 6.776 6.776zM16 18c-1.105 0-2-0.895-2-2s0.895-2 2-2c1.105 0 2 0.895 2 2s-0.895 2-2 2zM14 7.224v3.118c-1.705 0.603-3.056 1.953-3.658 3.658h-3.118c0.765-3.36 3.416-6.010 6.776-6.776zM7.224 18h3.118c0.603 1.705 1.953 3.056 3.658 3.658v3.118c-3.36-0.765-6.010-3.416-6.776-6.776zM18 24.776v-3.118c1.705-0.603 3.056-1.953 3.658-3.658h3.118c-0.765 3.36-3.416 6.010-6.776 6.776z"
      }
    }
  )
  Vue.use(VTooltip)
  export default {
    data() {
      return {
        thumbSrc: null,
        jsMindContainer: null,
        id: null,
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
        showSuccessTip: false,
        timeout: null,
        isSaving: false,
        centerTimeOut: null
      }
    },
    methods: {
      submit() {
        this.swal({
                    text: "是否要将此版图谱归档为历史版本，方便您后续回溯？",
                    title: "提交图谱",
                    buttons: {
                      cancel: {
                        text: '取消',
                        visible: true,
                      },
                      confirm: {
                        text: '提交',
                        visible: true,
                      },
                    },
                  })
            .then((isConfirm) => {
              //todo add submit api
              if (isConfirm) {
                this.swal({
                            text: "已成功归档，您可以在 XXX 处回溯查阅。",
                            title: "提交成功",
                            icon: "success",
                          })
              }
            })
      },

      getCurrentNodes(){
        return Object.keys(this.jm.mind.nodes)
                     .map((id) => {
                       const node = this.jm.mind.nodes[id]
                       return {
                         NID: id,
                         title: node.topic,
                         direction: node.direction == -1 ? 'left' : 'right',
                         GID: this.id,
                         FNID: node.isroot ? 0 : node.parent.id
                       }
                     })
      },
      save() {
        this.isSaving = true
        const nodes = Object.keys(this.jm.mind.nodes)
                            .map((id) => {
                              const node = this.jm.mind.nodes[id]
                              return {
                                NID: id,
                                title: node.topic,
                                direction: node.direction == -1 ? 'left' : 'right',
                                GID: this.id,
                                FNID: node.isroot ? 0 : node.parent.id
                              }
                            })
        this.$http.post(`/api/graph`, {
          nodes,
          graph: {
            GID: this.id,  //todo create or update?
            entity: this.graph.entity,
            company: 'company', //todo
            author: 'author'
          }
        })
            .then(res => {
              if (this.timeout) {
                clearTimeout(this.timeout)
              }
              this.isSaving = false
              this.showSuccessTip = true
              this.timeout = setTimeout(() => {
                this.showSuccessTip = false
                this.timeout = null
              }, 2000)
            })
      },
      goCenter() {
        if (this.centerTimeOut) return
        const inner = $(".jsmind-inner")
          .children()
        inner.addClass('animation')
        const originTransform = inner[0].style.transform
        inner.css(
          'transform', `translate(0px, 0px)` + originTransform.replace(/translate\(.*?\)/, ''))
        //fixed
        this.centerTimeOut = setTimeout(() => {
          this.updateThumbnail()
          inner.removeClass('animation')
          this.centerTimeOut = null
          this.currX = 0
          this.currY = 0
        }, 500)
      },

      toggleDrag() {
        console.log('drag')
        this.isDrag = !this.isDrag
        const inner = $(".jsmind-inner")
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
        this.updateThumbnail()
      },
      updateThumbnail() {
        if (this.showThumb) {
          html2canvas(this.jsMindContainer)
            .then((canvas) => {
              this.thumbSrc = canvas.toDataURL()
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
      }
    },
    mounted() {

      const options = {                   // options 将在下一章中详细介绍
        container: 'jsmind_container', // [必选] 容器的ID，或者为容器的对象
        editable: true,                // [可选] 是否启用编辑
        theme: 'primary', // [可选] 主题
        shortcut: {
          enable: false
        }
      }
      this.jm = new jsMind(options)


      this.id = this.$route.params.id
      const {id} = this
      this.$http.get(`/api/graph/${id}`)
          .then(res => {
            this.graph = res
            this.nodes = this.graph.nodes.map(({title, FNID, direction, NID,GNID}) => {
              return {
                GNID,
                id: NID,
                isroot: FNID == 0,
                parentid: FNID,
                topic: title,
                direction
              }
            })
            const mind = {
              /* 元数据，定义思维导图的名称、作者、版本等信息 */
              'meta': {
                'name': 'example',
                'author': 'hizzgdev@163.com',
                'version': '0.2'
              },
              /* 数据格式声明 */
              'format': 'node_array',
              /* 数据内容 */
              'data': this.nodes
            }
            this.jm.show(mind)
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
                console.log(node)
                EventBus.$emit('nodeModal', node)
              } else {
                logger.error('fail, this mind map is not editable.')
                return
              }
            },
              this.updateThumbnail()
          })

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
      EventBus.$on('nodeModalClose', (node) => {
        this.jm.update_node(node.id, node.topic)
      })

      this.jsMindContainer = $('#jsmind_container')
//      this.jsMindContainer.css('height',window.innerHeight-40-$('.top-op').height())


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
    #jsmind_container {
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
      /*width: 150px;*/
      height: 90px;
      border: 1px solid #ccc;
      /*display: none;*/
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0
  }


</style>
