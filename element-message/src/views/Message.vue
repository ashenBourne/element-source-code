<template>
  <div>
    <el-button type="primary" @click="showMessage">显示message</el-button>
    <el-button type="primary" @click="showSelfMessageRender">render</el-button>
    <el-button type="primary" @click="showSelfMessageHTML"
      >dangerouslyUseHTMLString</el-button
    >
  </div>
</template>

<script>
export default {
  name: "Message",
  data() {
    return {};
  },
  methods: {
    showMessage() {
      this.$message.success("展示message");
    },
    showSelfMessageHTML() {
      this.$messageSelf.success({
        dangerouslyUseHTMLString:true,
        message:"<div style='color:red'>这是红色的</div>"
      })
    },
    showSelfMessageRender(){
      const h = this.$createElement;
      this.$messageSelf.success({
        message:h("p",null,[h("span",{style:"color:red"},"内容是红色的")])
      })
    }
  },
};
</script>

<style lang="less" scoped>
</style>