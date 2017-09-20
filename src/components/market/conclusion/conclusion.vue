<!--结论组件-->
<template>
  <div class="conclusion">
    <h2>
      核心结论
    </h2>
    <ul>
      <li v-for="(conclusion,index) in conclusions">
       {{conclusion}}
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      conclusions: {
        type: Array,
        required: true,
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .conclusion h2 {
    border-bottom: 1px solid #e2dddd;
    padding-bottom: 10px;
    margin-bottom: 10px;
    width: 200px;
  }

  .conclusion li {
    font-size: 18px;
  }

</style>
