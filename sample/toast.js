
export function showToast(text) {
    Toastify({
        text: text,
        duration: 3000,
        className: "info",
        gravity: "top", 
        position: "center", 
        style: {
          background: "#afa8a7",
        }
      }).showToast();
}
  