
export function showToast(text) {
  Toastify({
      text: text,
      duration: 3000, // 显示时间：3秒
      className: "custom-toast",
      gravity: "top", // 显示位置：顶部
      position: "center", // 居中对齐
      style: {
          background: "#333333", // 简约深灰色背景
          color: "#ffffff", // 白色文字
          fontSize: "14px", // 适中的字体大小
          borderRadius: "6px", // 圆角
          padding: "8px 16px", // 内边距
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)", // 轻微阴影
      },
      offset: {
          y: 20, // 距离顶部20px
      },
  }).showToast();
}