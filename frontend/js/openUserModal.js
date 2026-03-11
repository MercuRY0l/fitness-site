


export function openUserModal() {
    const modal = document.getElementById("modal-user")
    const btn = document.getElementById("open-modal-user-btn")
    const btn_close = document.getElementById("close-modal-user-btn")
    

    btn.onclick = function(){
        modal.style.display = "flex";
    }

    btn_close.onclick = function(){
        modal.style.display = "none";
    }

    window.onclick = function(){

        if (this.event.target === modal){
           modal.style.display = "none";
        
        }

    }
}