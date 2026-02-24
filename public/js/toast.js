let toastContainer = null;

function getToastContainer() {
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    return toastContainer;
}

export function showToast(message, type = 'info', duration = 3000) {
    const container = getToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon toast-icon-${type}"></span>
            <span class="toast-message">${message}</span>
        </div>
    `;
    
    container.appendChild(toast);
    
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 500);
    }, duration);
    
    return toast;
}

export const toast = {
    info: (message, duration) => showToast(message, 'info', duration),
    success: (message, duration) => showToast(message, 'success', duration),
    warning: (message, duration) => showToast(message, 'warning', duration),
    error: (message, duration) => showToast(message, 'error', duration)
};
