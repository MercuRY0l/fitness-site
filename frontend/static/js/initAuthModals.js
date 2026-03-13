export function initAuthModals() {

  const loginModal = document.getElementById("modal-login");
  const registerModal = document.getElementById("modal-register");

  document.querySelector(".open-login-btn")
    .addEventListener("click", () => {
      loginModal.classList.add("active");
    });

  document.querySelectorAll(".close-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const modalId = btn.getAttribute("data-close");
      document.getElementById(modalId).classList.remove("active");
    });
  });


  [loginModal, registerModal].forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("active");
    });
  });

  document.querySelectorAll(".switch-modal").forEach(el => {

    el.addEventListener("click", () => {

      const target = el.dataset.target;

      loginModal.classList.remove("active");
      registerModal.classList.remove("active");

      document.getElementById(target).classList.add("active");

    });

  });

}