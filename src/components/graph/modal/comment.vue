<template>
  <div>
    <textarea id="editor"
              style="width: 90%"
              placeholder="输入笔记内容..."
              autofocus></textarea>
    <div style="display: flex;flex-direction: row-reverse">
      <span style="padding: 10px;color: #2c8abf;cursor: pointer;" @click="save()">发表评论</span>
    </div>
  </div>
</template>
<script>
  import Simditor from 'simditor'
  import 'simditor/styles/simditor.css'
  export default {
    data(){
      return{
        editor:null,
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
          console.log(this.editor.getValue());
        }
      }
    }
  }
</script>
<style>

</style>
