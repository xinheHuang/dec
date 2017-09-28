<template>
  <div>
    <div class="top-op">
      <div>
        <span @click="addParallelNode()">
          加入同级节点
        </span>
        <span @click="addChildNode()">
          加入下级节点
        </span>
        <select v-model="selected" @change="selectChange()">
          <option disabled value="">展开</option>
          <option :value="index+1" v-for="(v,index) in Array(7)">展开到{{numberZh[index+1]}}级节点</option>
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
      <div id="jsmind_container"></div>
      <div v-if="jm"
           class="left-op"
      >
        <span :disabled="zoomInDisabled"
              class="iconplus icon-plus-circle"
              @click="zoomIn()"></span>
        <input type="range"
               style="-webkit-appearance: slider-vertical;writing-mode: bt-lr"
               min="0.5"
               max="2"
               orient="vertical"
               step="0.1"
               @change="changeZoom()"
               v-model="currentZoom" />
        <span :disabled="zoomOutDisabled"
              class="iconplus icon-minus-circle"
              @click="zoomOut()"></span>
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
  Vue.use(VTooltip)
  export default {
    data() {
      return {
        id: null,
        jm: null,
        zoomOutDisabled: false,
        zoomInDisabled: false,
        currentZoom: 1,
        selected:'',
        numberZh
      }
    },
    methods: {
      selectChange(){
        console.log(this.selected);
        this.jm.expand_to_depth(this.selected);
      },
      changeZoom() {
        this.jm.view.setZoom(this.currentZoom)
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
      },
      zoomOut() {
        if (this.jm.view.zoomOut()) {
          this.zoomInDisabled = false
        } else {
          this.zoomOutDisabled = true
        }
        this.currentZoom = this.jm.view.actualZoom
      },
      addChildNode() {
        const selected_node = this.jm.get_selected_node()
        if (!selected_node) {
          alert('请先选择一个节点')
          return
        }
        const nodeid = jsMind.util.uuid.newid()
        const topic = '* Node_' + nodeid.substr(0, 5) + ' *'
        const node = this.jm.add_node(selected_node, nodeid, topic)
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
        const topic = '* Node_' + nodeid.substr(0, 5) + ' *'
        const node = this.jm.add_node(selected_node.parent, nodeid, topic)
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
      const { id } = this
      this.$http.get(`/api/graph/${id}`)
        .then(res => {
          this.graph = res.data
          console.log(this.graph)
          this.nodes = this.graph.graph_nodes.map(({ title, FNID, direction, NID }) => {
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
        })


    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less"
       scoped>
  #jsmind_container {
    width: 100%;
    height: 500px;
    border: solid 1px #ccc;
    /*background:#f4f4f4;*/
    background: #f4f4f4;
  }

  .top-op {
    display: flex;
    background: #e2dddd;
    justify-content: space-between;
    align-items: center;
    width: 100%;
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
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    span {
      color: #ccc;
    }
    input {
      width: 20px;
    }
  }
</style>
