<template>
  <div id="graph">
    <div class="top-op">
      <div style="display: flex;align-items: center">
        <img :src="require('../../assets/images/samelevelnode.png')"/>
        <span @click="addParallelNode()">
          加入同级节点
        </span>
        <img :src="require('../../assets/images/nextlevelnode.png')"/>
        <span @click="addChildNode()">
          加入下级节点
        </span>
        <span @click="removeNode()">
          删除节点
        </span>
        <img :src="require('../../assets/images/shownodes.png')"/>
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
        <span @Click>
          保存
        </span>
        <span @Click
              v-tooltip.bottom="{content:'将此版图谱记录为历史版本'}">
          提交
        </span>
      </div>
    </div>
    <div style="position: relative">
      <div id="jsmind_container"
           @click="handleClick"></div>
      <div v-if="jm"
           class="left-op"
      >
        <img :src="require('../../assets/images/plus.png')"
             @mousedown="handleButton($event)"
             @mouseup="handleButton($event)"
             @click="zoomIn()"/>
        <input type="range"
               style="-webkit-appearance: slider-vertical;writing-mode: bt-lr"
               min="0.5"
               max="2"
               orient="vertical"
               step="0.1"
               @change="changeZoom()"
               v-model="currentZoom"/>
        <img :src="require('../../assets/images/minus.png' )"
             @mousedown="handleButton($event)"
             @mouseup="handleButton($event)"
             @click="zoomOut()"/>
        <img :src="require('../../assets/images/drag.png')"
             :class="{'selected':isDrag}"
             @click="toggleDrag"/>
        <img :src="require('../../assets/images/position.png')"
             @mousedown="handleButton($event)"
             @mouseup="handleButton($event)"
             @click="goCenter()"
        />
        <img :src="require('../../assets/images/eye.png')"
             :class="{'selected':showThumb}"
             @click="showThumbnail"/>
      </div>
      <div class="thumbnail"
           id="thumbnail"
           v-show="showThumb">
      </div>
    </div>

  </div>
</template>

<script>
  import Vue from 'vue'
  import jsMind from 'jsmind'
  import 'jsmind/style/jsmind.css'
  import VTooltip from 'v-tooltip'
  import {numberZh} from '../../utils'
  import '../../assets/js/html2canvas'
  import '../../assets/js/jquery-ui-1.12.1.custom/jquery-ui.min'
  import EventBus from '../../eventBus'

  Vue.use(VTooltip)
  export default {
    data() {
      return {
        id: null,
        jm: null,
        zoomOutDisabled: false,
        zoomInDisabled: false,
        currentZoom: 1,
        selected: '',
        showThumb: false,
        isDrag: false,
        numberZh,
      }
    },
    methods: {
      handleButton(e){
        const target=$(e.target)
        if (e.type==='mousedown'){
          target.addClass('selected')
        }else{
          target.removeClass('selected')
        }
      },
      goCenter(){
        $(".jsmind-inner").animate({"left":"0" ,"top":"0"})
        this.updateThumbnail()
      },

      toggleDrag() {
        console.log('drag')
        this.isDrag = !this.isDrag
        if (this.isDrag)
          $(".jsmind-inner")
            .draggable({
                         stop: () => {
                           this.updateThumbnail()
                         }
                       })
        else
          $(".jsmind-inner")
            .draggable('destroy')
      },
      handleClick() {
        this.updateThumbnail()
      },
      showThumbnail() {
        this.showThumb = !this.showThumb
        this.updateThumbnail();
      },
      updateThumbnail() {
        if (this.showThumb) {
          html2canvas(document.getElementById('jsmind_container'), {
            onrendered: function (canvas) {
              var extra_canvas = document.createElement("canvas")
              extra_canvas.setAttribute('width', 150)
              extra_canvas.setAttribute('height', 90)
              var ctx = extra_canvas.getContext('2d')
              ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 150, 90)
              var dataURL = extra_canvas.toDataURL()
              var img = $(document.createElement('img'))
              img.attr('src', dataURL)
              $('#thumbnail')
                .html(img)
            }
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
        this.jm.view.setZoom(this.currentZoom)
        this.updateThumbnail()
      },
      zoomIn() {
        console.log(this)
        let i = this.jm.view.zoomIn()
        console.log(this.jm.view, i)
        if (i) {
          this.zoomOutDisabled = false
        } else {
          this.zoomInDisabled = true
        }
        this.currentZoom = this.jm.view.actualZoom
        this.updateThumbnail()
      },
      zoomOut() {
        if (this.jm.view.zoomOut()) {
          this.zoomInDisabled = false
        } else {
          this.zoomOutDisabled = true
        }
        this.currentZoom = this.jm.view.actualZoom
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
        theme: 'primary',                // [可选] 主题
      }
      this.jm = new jsMind(options)


      this.id = this.$route.params.id
      const {id} = this
      this.$http.get(`/api/graph/${id}`)
          .then(res => {
            this.graph = res.data
            console.log(this.graph)
            this.nodes = this.graph.graph_nodes.map(({title, FNID, direction, NID}) => {
              return {
                id: NID,
                isroot: FNID === 0,
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
            this.jm.begin_edit=function(node){
              if(!jsMind.util.is_node(node)){
                var the_node = this.get_node(node);
                if(!the_node){
                  logger.error('the node[id='+node+'] can not be found.');
                  return false;
                }else{
                  return this.begin_edit(the_node);
                }
              }
              if(this.get_editable()){
                console.log(node);
                EventBus.$emit('nodeModal',node)
              }else{
                logger.error('fail, this mind map is not editable.');
                return;
              }
            },

            console.log(this.jm.dblclick_handle);
            this.updateThumbnail()
          })

      EventBus.$on('nodeModalClose', (node) => {
        this.jm.update_node(node.id,node.topic);
      })

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  #graph {
    #jsmind_container {
      width: 100%;
      height: 800px;
      border: solid 1px #ccc;
      /*background:#f4f4f4;*/
      background: #f4f4f4;
      .jsmind-inner {
        overflow: hidden;
      }
    }

    .top-op {
      display: flex;
      background: #efefef;
      justify-content: space-between;
      align-items: center;
      width: 100%;
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
        }
      }
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
      img {
        width: 30px;
        padding: 5px;
        opacity: 0.4;
        &.selected{
          opacity: 1;
        }
      }
    }

    .thumbnail {
      position: absolute;
      bottom: 35px;
      left: 60px;
      width: 150px;
      height: 90px;
      border: 1px solid #ccc;
      /*display: none;*/
    }
  }

</style>
