import { EventListenerOrListenerObject, Monetization, MonetizationEventMap, MonetizationState } from "types-wm";

export class SolidWebMonetization implements Monetization {
    readonly state: MonetizationState = 'pending';

    onstart: EventHandlerNonNull;

    onprogress: EventHandlerNonNull;

    addEventListener<K extends keyof MonetizationEventMap>(type: K, listener: EventListenerOrListenerObject<Monetization, MonetizationEventMap[K]>, options?: boolean | AddEventListenerOptions): void {
        throw new Error("Method not implemented.");
    }

    removeEventListener<K extends keyof MonetizationEventMap>(type: K, listener: EventListenerOrListenerObject<Monetization, MonetizationEventMap[K]>, options?: boolean | EventListenerOptions): void {
        throw new Error("Method not implemented.");
    }

    dispatchEvent(event: Event): boolean {
        throw new Error("Method not implemented.");
    }   

    

}

