<template>
  <div id="indicators">
    <div v-if="editMode">
      <div style="display: flex;align-items: center;justify-content: space-between;flex-direction: row-reverse">
        <search-bar :search="search"
                    placeHolder="搜索指标" />
        <div v-if="currentSelectIndicator">
          <span style="border: none;margin-right: 10px">已选中指标：{{currentSelectIndicator.name}}</span>
          <span style="cursor: pointer;color: #2c8abf;border: none"
                v-if="!warningIDs.includes(currentSelectIndicator.ID)"
                @click="addIndicator(currentSelectIndicator)">添加关联</span>
          <span v-else>已添加</span>
        </div>
      </div>

      <div class="indicator-table">
        <div class="table">
          <div style="display: flex">
            <span class="name">指标名称</span>
            <span class="frequency">发布频次</span>
            <span class="unit">单位</span>
            <span class="source">来源</span>
          </div>
          <div v-for="indicator in currentIndicators"
               @click="clickIndicator(indicator)"
               class="indicator"
               :key="indicator.ID"
               :class="{selected:currentSelectIndicator==indicator}">
            <span class="name">{{indicator.name}}</span>
            <span class="frequency">{{indicator.frequency}}</span>
            <span class="unit">{{indicator.unit}}</span>
            <span class="source">{{indicator.source}}</span>
          </div>
        </div>
        <div class="op">
          <pagination :total="totalPage"
                      ref="pagination"
                      :pageSize="pageSize"
                      :changePage="onPageChange"></pagination>

        </div>
      </div>
    </div>

    <div class="warning-graphs">
      <div v-for="(warning,index) in indicatorWarnings"
           :key="warning.indicatorId">
        <div class="title-row">
          <h5 class="title">{{warning.name}}</h5>
          <div class="op">
            <div class="icon"
                 @click="editMode && clickWarn(warning)"
                 :class="{selected:warning.warn_type>0}">
              <icon name="bell" />
            </div>
            <div class="icon"
                 @click="clickDownload(warning)"
                 v-button>
              <icon name="download" />
            </div>
            <div class="icon"
                 v-if="editMode"
                 @click="clickRemove(warning,index)"
                 v-button>
              <icon name="trash" />
            </div>
          </div>
        </div>
        <div style="height: 200px;text-align: center">
          graph here
        </div>
        <div style="display: flex;align-items: center;justify-content: space-between;padding: 0 20px;margin-left: 40px">
          <div class="type"
               :class="{shown:warning.warn_type>0}">

            <!--fixed-->
            <select v-model="warning.warnType1"
                    :disabled="!editMode"
                    @change="type1Change(warning)">
              <option value="1">绝对值</option>
              <option value="2">增速</option>
            </select>
            <select v-model="warning.warnType2"
                    :disabled="!editMode"
                    v-if="warning.warnType1!=1">
              <option value="0">同比</option>
              <option value="1">环比</option>
            </select>
            <select v-model="warning.warnType2"
                    disabled
                    v-if="warning.warnType1==1">
              <option value="0"></option>
            </select>

            <input v-model="warning.upper_limit"
                   :disabled="!editMode" />
            <input v-model="warning.lower_limit"
                   :disabled="!editMode" />

          </div>
          <div class="icon"
               v-if="editMode"
               @click="saveWarnChange(warning)"
               v-button>
            <icon name="save" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

  import SearchBar from '../../searchBar/searchBar.vue'
  import pagination from 'Component/pagination/pagination.vue'

  export default {
    props: {
      node: Object,
      editMode: Boolean,
      saved: Function,
      saving: Function,
      saveFailed:Function,
    },
    data() {
      return {
        selectType1: 1,
        selectType2: 0,
        currentPage: 1,
        currentIndicators: [],
        currentSelectIndicator: null,
        indicatorWarnings: [],
        pageSize:5,
        totalPage:0,
        searchKey:null,
      }
    },
    computed: {
      GNID() {
        return this.node.graphNodeId
      },
      warningIDs() {
        return this.indicatorWarnings.map((warning) => warning.indicatorId)
      }
    },
    methods: {
      addIndicator(indicator) {
        if (this.warningIDs.includes(indicator.ID)) {
          return
        }
        this.$http.post(`/api/graphNode/${this.GNID}/indicator/`, {
          indicatorId: indicator.ID,
        })
          .then(warning => {
            this.indicatorWarnings.unshift(warning)
          })
      },
      saveWarnChange({ warn_type, warnType1, warnType2, ID, upper_limit, lower_limit }) {
        this.saving('设置中...')
//        const {warn_type,warnType1,warnType2,IID,ID,upper_limit,lower_limit}=warning
        const warnType = warn_type == 0 ? 0 : (+warnType1) + (+warnType2)
        this.$http.put(`/api/graphIndicator/${ID}`, {
          upper_limit,
          lower_limit,
          warn_type: warnType
        })
          .then(res => {
            this.saved('设置成功')
          }).catch(()=>{
          this.saveFailed('设置失败')
        })
      },
      clickDownload(warning) {
        console.log('download')
        // todo
      },
      async clickRemove(warning, index) {
        const r = await this.swal({
          text: '确定删除指标关联？',
          title: '删除关联',
          buttons: {
            cancel: {
              text: '取消',
              visible: true,
            },
            confirm: {
              text: '删除',
              visible: true,
            },
          },
        })
        if (r) {
          this.$http.delete(`/api/graphIndicator/${warning.graphNodeIndicatorId}`)
            .then((res) => {
              this.indicatorWarnings.splice(index, 1)
            })
        }
      },
      clickWarn(warning) {
        console.log('click')
        if (warning.warn_type > 0) {
          warning.warn_type = 0
        }
        else {
          warning.warn_type = 1
          this.setWarnType(warning)
        }
      },
      type1Change(warning) {
        warning.warnType2 = 0
      },
      search(key) {
        this.searchKey=key;
        this.$nextTick(() => {
          this.$refs.pagination.setPage(0)
          this.onPageChange(1)
        })
      },

      onPageChange(page){
        this.saving('搜索中...')
        this.currentPage=page;
        this.$http.get(`/api/indicator?pageSize=${this.pageSize}&pageNumber=${this.currentPage}&key=${this.searchKey || ''}`)
          .then(({indicators,total}) => {
            this.currentIndicators = indicators
            this.totalPage=total
            this.saved()
          })
      },
      clickIndicator(indicator) {
        if (indicator === this.currentSelectIndicator) {
          this.currentSelectIndicator = null
        }
        else {
          this.currentSelectIndicator = indicator
        }
      },
      setWarnType(warn) {
        this.$set(warn, 'warnType1', warn.warn_type == '1' ? 1 : 2)
        this.$set(warn, 'warnType2', warn.warn_type == '1' ? 0 : 3 - warn.warn_type)
        this.$set(warn, 'upper_limit', warn.upper_limit)
        this.$set(warn, 'lower_limit', warn.lower_limit)
        console.log(warn)
      }
    },
    mounted() {
      this.$http.get(`/api/graphNode/${this.GNID}/indicators`,)
        .then((res) => {
          this.indicatorWarnings = res
          console.log(this.indicatorWarnings)
          this.indicatorWarnings.forEach((warn) => {
            this.setWarnType(warn)
          })
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
    components: {
      SearchBar,
      pagination
    }
  }
</script>
<style lang="less"
       scoped>
  #indicators {
    padding: 10px 20px 0;
    .unit {
      width: 100px;
      flex-shrink: 0;
    }
    .frequency {
      width: 150px;
      flex-shrink: 0;
    }
    .source {
      width: 300px;
      flex-shrink: 0;
    }
    .name {
      flex-grow: 1;
    }
    .indicator-table {
      margin-top: 20px;
      .table {
        .indicator {
          cursor: pointer;
          display: flex;
          &.selected {
            background: #2c8abf;
          }
        }
        span {
          border: 1px solid lightgray;
          padding: 10px;
        }
      }
    }

    .icon {
      > * {
        height: 20px;
        width: auto;
        color: #ccc;
        margin-right: 10px;
      }
      &.selected {
        > * {
          color: #2c8abf;
        }
      }
    }

    .warning-graphs {
      margin-top: 20px;
      display: flex;
      flex-wrap: wrap;
      > div {
        width: 50%;
        padding: 5px 0;
        .title-row {
          padding: 0 20px;
          position: relative;
          .title {
            text-align: center;
          }
          .op {
            position: absolute;
            right: 20px;
            top: 0;
            display: flex;
          }
        }
        .type {
          margin-left: 20px;
          visibility: hidden;
          &.shown {
            visibility: visible
          }
          display: flex;
          align-items: center;
          justify-content: space-around;
          > * {
            margin-right: 10px;
            flex-grow: 0;
            flex-shrink: 1;
          }
          > input {
            width: 50px;
          }
        }
      }
    }
  }
</style>
