<template>
  <div style="width:200px;padding: 16px 50px 0">
    <div class="key" @click="$emit('companySelect',companyList)"
         :class="{'selected':selected}"
    >
      <div>
        {{companyList.team}}
      </div>
      <div>
        {{companyList.group}}
      </div>
    </div>
    <div class="items">
      <div v-for="item in companyList.item"
           class="item">
        <div class="item-title"><p>
          {{getTitle(item)}}
        </p></div>
        <div class="divider"
             style="margin: 0 10px"></div>
        <div>
          <div style="display: flex;align-items: center">
            <span class="iconplus icon-plus-circle">     </span>
            <span style="margin-left: 20px">
              {{item.plus}}
            </span>
          </div>

          <div style="display: flex;align-items: center">
            <span class="iconplus icon-minus-circle">     </span>
            <span style="margin-left: 20px">
              {{item.minus}}
            </span>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import '../../../../assets/font/plus/style.css'

  export default {
    props: {
      companyList: {
        type: Object,
        required: true,
      },
      selected:{
        type:Boolean,
        default:true
      }
    },
    methods: {
      getTitle(item) {
        const title = `${item.date}：${item.title}`
        return title.length <= 24 ? title :
          title.slice(0, 23) + ' ...'
      }
    }
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
    /*overflow: hidden;*/
    /*text-overflow: ellipsis;*/
    margin-bottom: 10px;
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
