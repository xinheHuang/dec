<template>

  <select v-model="select"
          class="button-blue"
          @change="$emit('change',select)"
          style="padding-left: 5px">
    <option disabled v-if="hint"
            value=""> {{hint}}
    </option>
    <option v-for="option in options"
            :value="option">
      {{option.text}}
    </option>
  </select>

</template>
<script>
  export default {
    props: {
      hint: String,
      options:Array,
      default:Object,
      selectChange:Function,
    },
    data(){
      return {
        select: this.default
      }
    },
    mounted(){
      console.log(this.default);
    }
  }
</script>
<style scoped lang="less">
  select{
    /*appearance:none;*/
    text-align: center;
    box-sizing: border-box;
    option{
      //todo
    }
  }

</style>
