import { EventListener, Monetization, MonetizationEvent, MonetizationEventMap, MonetizationState } from "types-wm";
import { v4 as uuidv4 } from "uuid";

type MonetizationEventType = keyof MonetizationEventMap;


export class SolidWebMonetization implements Monetization {
    state: MonetizationState = 'pending';

    onstart: EventHandlerNonNull;
    onprogress: EventHandlerNonNull;

    private paymentPointer: string = undefined;
    private monetizationId: string = undefined;

    private listeners: Map<MonetizationEventType, EventListener<Monetization, MonetizationEvent>[]> = new Map();

    addEventListener<K extends keyof MonetizationEventMap>(type: K, listener: EventListener<Monetization, MonetizationEvent>, options?: boolean | AddEventListenerOptions): void {
        let record = this.listeners.get(type);
        if (!record) {
            record = [];
        }
        record.push(listener);
        this.listeners.set(type, record);
    }

    removeEventListener<K extends keyof MonetizationEventMap>(type: K, listener: EventListener<Monetization, MonetizationEvent>, options?: boolean | EventListenerOptions): void {
        throw new Error("Method not implemented.");
    }

    dispatchEvent(event: Event): boolean {
        throw new Error("Method not implemented.");
    }

    constructor() {
        // Set initial state
        this.setPendingState();

        // Search for existing meta tag now
        this.searchStaticMetaTag();

        // start listening for changes on meta tag later
        this.listenForMetaTagChanges();
    }

    /**
     * Start listening for changes on the meta[name=monetization] in the head section
     */
    private listenForMetaTagChanges() {
        const observer = new MutationObserver(list => {
            console.log(list)
            list
                .filter(item => item.target['name'] === 'monetization')
                .filter(item => item.target['content'] && item.target['content'] !== this.paymentPointer)
                .forEach(item => {
                    this.setPaymentPointer(item.target['content']);
                    this.setupPaymentRequest();
                })
        });
        observer.observe(document.head, { attributeFilter: ['name'], attributes: true, childList: false, subtree: true });
    }

    /**
     * Sets a new payment pointer string and generates a unique (uuid v4) monetizationId.
     * @param pointer The new payment pointer string
     */
    private setPaymentPointer(pointer: string) {
        console.log('new pointer', pointer)
        if (pointer != this.paymentPointer) {
            this.paymentPointer = pointer;
            // Generate unique UUID (v4)
            this.monetizationId = uuidv4();
            this.setStoppedState();
        }
        this.printInfo();
    }

    private setStoppedState() {
        this.state = 'stopped';
        this.fireStopped();
    }

    private setStartedState() {
        this.state = 'started';
        this.fireStarted();
    }

    private setPendingState() {
        this.state = 'pending';
        this.firePending();
    }

    private setProgressState() {
        // TODO: Not implemented yet
    }

    private printInfo() {
        const data = {
            paymentPointer: this.paymentPointer,
            monetizationId: this.monetizationId
        }
        console.table(data)
    }

    private searchStaticMetaTag(): void {
        let result = null;
        let metas = document.getElementsByTagName('meta');
        for (let i = 0; i < metas.length; i++) {
            let meta = metas.item(i);
            if (meta?.name === 'monetization') {
                result = meta;
            }
        }
        if (result) {
            this.setPaymentPointer(result.content)
            this.setupPaymentRequest();
        }
    }

    private setupPaymentRequest() {
        const req = new PaymentRequest([{
            "supportedMethods": "webmonetization",
            "data": {
                "paymentPointer": this.paymentPointer
            }
        }], { total: { amount: { currency: 'USD', value: '10000' }, label: 'Total due' } }, {})
        req.show(null).then(msg => console.log(msg));
    }

    private firePending() {
        this.listeners.get('monetizationpending')?.forEach(listener => listener.call(this, { type: 'monetizationpending' }));
    }

    private fireStopped() {
        this.listeners.get('monetizationstop')?.forEach(listener => listener.call(this, { type: 'monetizationstop' }));
    }
    private fireStarted() {
        this.listeners.get('monetizationstart')?.forEach(listener => listener.call(this, { type: 'monetizationstart' }));
    }
    private fireProgress() {
        this.listeners.get('monetizationprogress')?.forEach(listener => listener.call(this, { type: 'monetizationprogress' }));
    }


}

