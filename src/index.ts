import { SolidWebMonetization } from "./wm";

(function () {
    console.log('SOLID-WM load..');

    window.document.monetization = new SolidWebMonetization();

    console.log('SOLID-WM inited!');
})();
