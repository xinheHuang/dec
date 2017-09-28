<template>
  <div>
    <textarea id="editor"
              style="width: 90%"
              placeholder="输入笔记内容..."
              autofocus></textarea>
    <div style="display: flex;flex-direction: row-reverse">
      <span style="padding: 10px;color: #2c8abf;cursor: pointer;" @click="save()" v-show="!saving">发表评论</span>
      <span style="padding: 10px;color: #2c8abf;"  v-show="saving">发表中...</span>
    </div>
  </div>
</template>
<script>
  import Simditor from 'simditor'
  import 'simditor/styles/simditor.css'
  export default {
    props:{
      node:Object,
      saved:Function,
    },
    data(){
      return{
        editor:null,
        saving:false,
      }
    },
    mounted(){
      this.editor = new Simditor({
                                  textarea: $('#editor')
                                  //optional options
                                });
    },
    methods:{
      save(){
        if (this.editor){
          this.saving=true;
          this.$http.post(`/api/graph/node/${this.node.id}/comment`,{
            author: 'author',  //todo
            institution: 'institution',
            content:this.editor.getValue()
          }).then((res)=>{
            this.saved();
            this.saving=false;
          })
        }
      }
    }
  }
</script>
<style>

.simditor .simditor-body{
  min-height: 200px;
  /*min-width: 90%*/
}
</style>
