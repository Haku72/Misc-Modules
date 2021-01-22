interface ISubscriber {
    ref: Record<string, unknown>,
    cb : (args?: unknown) => unknown
}

interface ISubscriptionDictionary {
    [eventName: string]: Array<ISubscriber>
}

/**
 * Simple implementation of the Publisher /Subscriber pattern. Useful for signalling events between separate modules triggering
 * callbacks, similar to addEventListener
 *
 */
class _PubSub {

    private subscribers: ISubscriptionDictionary = {};
    /**
     * Publish a given event
     *
     * @param event : string event name
     * @param data : any data to be passed to callback
     */
    publish(event: string, data:unknown = null) {
        const eventSubs = this.subscribers[event];

        if (!eventSubs) {
            return
        }

        eventSubs.forEach((obj: ISubscriber) => {
            obj.cb.call(obj.ref, data);
        });
    }


    /**
     * Subscribe to an event trigger
     *
     * @param object : object reference to subscribing object, i.e 'this'
     * @param event : string event name
     * @param callback : Function callback function
     */
    subscribe(object: Record<string, unknown>, event: string, callback: () => unknown) {
        let subs = this.subscribers[event];

        if(!subs) {
            subs = this.subscribers[event] = [];
        }

        subs.push({
            ref: object,
            cb: callback,
        });
    }

    /**
     * Unsubscribe from an event trigger, removing the specific callback function
     *
     * @param object : Any reference to unsubscribing object, i.e 'this'
     * @param event : string event name
     */
    unsubscribe(object: Record<string, unknown>, event: string) {
        const eventSubs = this.subscribers[event];

        if (!eventSubs) {
            return
        }
        eventSubs.forEach((obj: ISubscriber, i: number) => {
            if(obj.ref === object) {
                eventSubs.splice(i, 1);
            }
        });
    }
}

const PubSub = new _PubSub();
export { PubSub };