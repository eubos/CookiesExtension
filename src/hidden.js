import store from './store'
if (store.state.isEnabled) {
    let body = document.getElementsByTagName('body');
    body.style.visibility = "hidden";
    body.style.display = "none";
}
