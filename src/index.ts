import { SolidWebMonetization } from "./wm";

(function () {
    console.log('SOLID-WM loading..');

    window.document.monetization = new SolidWebMonetization();

    console.log('SOLID-WM inited!');
})();
