import { info } from "console";
import { EventListener, EventListenerOrListenerObject, Monetization, MonetizationEvent, MonetizationEventMap, MonetizationState } from "types-wm";
import { v4 as uuidv4 } from "uuid";

type MonetizationEventType = keyof MonetizationEventMap;


export class SolidWebMonetization implements Monetization {
    readonly state: MonetizationState = 'pending';

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
        this.state = 'pending';
        this.firePending();

        // Search for meta tag
        let meta = this.searchMetaTag();
        if (meta) {
            this.paymentPointer = meta.content;
        }

        // Generate unique UUID (v4)
        this.monetizationId = uuidv4();

        // Setup Payment Handler


        this.printInfo();
        this.state = 'stopped';
        this.fireStopped();
    }

    private printInfo() {
        const data = {
            paymentPointer: this.paymentPointer,
            monetizationId: this.monetizationId
        }
        console.table(data)
    }

    private searchMetaTag(): HTMLMetaElement | null {
        let result = null;
        let metas = document.getElementsByTagName('meta');
        for (let i = 0; i < metas.length; i++) {
            let meta = metas.item(i);
            if (meta.name === 'monetization') {
                result = meta;
            }
        }
        return result;
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

