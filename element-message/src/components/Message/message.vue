<template>
  <transition name="el-message-fade" @after-leave="handleAfterLeave">
    <div
      :class="[
        'el-message',
        type && !iconClass ? `el-message--${type}` : '',
        center ? 'is-center' : '',
        showClose ? 'is-closable' : '',
        customClass,
      ]"
      :style="positionStyle"
      v-show="visible"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
      role="alert"
    >
      <i :class="iconClass" v-if="iconClass"></i>
      <i :class="typeClass" v-else></i>
      <slot>
        <p v-if="!dangerouslyUseHTMLString" class="el-message__content">
          {{ message }}
        </p>
        <p v-else v-html="message" class="el-message__content"></p>
      </slot>
      <i
        v-if="showClose"
        class="el-message__closeBtn el-icon-close"
        @click="close"
      ></i>
    </div>
  </transition>
</template>

<script type="text/babel">
const typeMap = {
  success: "success",
  info: "info",
  warning: "warning",
  error: "error",
};

export default {
  data() {
    return {
      visible: false,
      // 消息文字
      message: "",
      // 显示时间, 毫秒。设为 0 则不会自动关闭
      duration: 3000,
      // 类型：success/warning/info/error
      type: "info",
      // 自定义class-icon类名
      iconClass: "",
      // 自定义类名
      customClass: "",
      // 关闭时的回调函数, 参数为被关闭的 message 实例
      onClose: null,
      // 是否显示关闭按钮
      showClose: false,
      // 本组件用于判断结束显示的标志
      closed: false,
      // 高度，用于多个实例同时出现时，往下加一定的高度
      verticalOffset: 20,
      // 定时器，三秒关闭这个实例
      timer: null,
      // 是否将 message 属性作为 HTML 片段处理
      dangerouslyUseHTMLString: false,
      // 居中显示
      center: false,
    };
  },

  computed: {
    // 根据类型显示不同的风格类名
    typeClass() {
      return this.type && !this.iconClass
        ? `el-message__icon el-icon-${typeMap[this.type]}`
        : "";
    },
    // 距离顶部的距离
    positionStyle() {
      return {
        top: `${this.verticalOffset}px`,
      };
    },
  },

  watch: {
    // 不知道为什么要再写个flag
    closed(newVal) {
      if (newVal) {
        this.visible = false;
      }
    },
  },

  methods: {
    // 动画执行完销毁el
    handleAfterLeave() {
      this.$destroy();
      this.$el.parentNode.removeChild(this.$el);
    },
    // 关闭操作，如果有回调，执行回调
    close() {
      this.closed = true;
      if (typeof this.onClose === "function") {
        this.onClose(this);
      }
    },
    // 清除定时器，鼠标放上去的时候，并不会消失
    clearTimer() {
      clearTimeout(this.timer);
    },
    // 实例一开始就开始执行定时器，鼠标一进来又重置
    startTimer() {
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          if (!this.closed) {
            this.close();
          }
        }, this.duration);
      }
    },
    // 监听ESC键
    keydown(e) {
      if (e.keyCode === 27) {
        // esc关闭消息
        if (!this.closed) {
          this.close();
        }
      }
    },
  },
  mounted() {
    this.startTimer();
    document.addEventListener("keydown", this.keydown);
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.keydown);
  },
};
</script>
