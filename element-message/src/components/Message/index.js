import Vue from 'vue';
import Main from './message.vue';
// 判断是否是VNode节点
import { isVNode } from '@/utils/util.js';
let MessageConstructor = Vue.extend(Main);

let instance;
let instances = [];
let seed = 1;

// 生成一个message实例
const Message = function (options) {
    // 服务器渲染不得行哦！
    if (Vue.prototype.$isServer) return;
    // 调用this.$message时传递进来的参数
    options = options || {};
    // 如果是this.$message("测试弹出")这样的，可以直接转换
    if (typeof options === 'string') {
        options = {
            message: options
        };
    }
    // 关闭回调
    let userOnClose = options.onClose;
    // 实例标识
    let id = 'message_' + seed++;
    // 添加关闭回调
    options.onClose = function () {
        Message.close(id, userOnClose);
    };
    // 创建message实例
    instance = new MessageConstructor({
        data: options
    });
    instance.id = id;
    // 接收render函数
    if (isVNode(instance.message)) {
        // https://cn.vuejs.org/v2/guide/render-function.html?  
        // 默认插槽接收一个节点数组
        instance.$slots.default = [instance.message];
        instance.message = null;
    }
    // 手动挂载
    instance.$mount();
    document.body.appendChild(instance.$el);
    // 多个实例的时候，逐个下沉16px
    let verticalOffset = options.offset || 20;
    instances.forEach(item => {
        verticalOffset += item.$el.offsetHeight + 16;
    });
    instance.verticalOffset = verticalOffset;
    // 展示实例
    instance.visible = true;
    // 处理z-index
    //   instance.$el.style.zIndex = PopupManager.nextZIndex();
    // 放入实例数组中
    instances.push(instance);
    return instance;
};
// 取别名 
['success', 'warning', 'info', 'error'].forEach(type => {
    Message[type] = options => {
        if (typeof options === 'string') {
            options = {
                message: options
            };
        }
        options.type = type;
        return Message(options);
    };
});
// 关闭删除实例
Message.close = function (id, userOnClose) {
    // 实例数量
    let len = instances.length;
    let index = -1;
    // 找到要关闭的实例下标
    let removedHeight;
    for (let i = 0; i < len; i++) {
        if (id === instances[i].id) {
            removedHeight = instances[i].$el.offsetHeight;
            index = i;
            // 如果有关闭回调
            if (typeof userOnClose === 'function') {
                userOnClose(instances[i]);
            }
            instances.splice(i, 1);
            break;
        }
    }
    if (len <= 1 || index === -1 || index > instances.length - 1) return;
    // 从删除的下标开始往回缩减高度
    for (let i = index; i < len - 1; i++) {
        let dom = instances[i].$el;
        dom.style['top'] =
            parseInt(dom.style['top'], 10) - removedHeight - 16 + 'px';
    }
};

Message.closeAll = function () {
    for (let i = instances.length - 1; i >= 0; i--) {
        instances[i].close();
    }
};

export default Message;
