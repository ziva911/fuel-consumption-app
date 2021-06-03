import EventEmitter from "eventemitter3";

const eventRegistry = new EventEmitter();
type EventType = 'AUTH_EVENT' |
    'VEHICLE_EVENT' |
    'REFUEL_EVENT';
type EventHandler = (...args: any[]) => void;

const EventRegistry = {
    on: (event: EventType, handler: EventHandler) => eventRegistry.on(event, handler),
    off: (event: EventType, handler: EventHandler) => eventRegistry.off(event, handler),
    once: (event: EventType, handler: EventHandler) => eventRegistry.once(event, handler),
    emit: (event: EventType, ...data: any) => eventRegistry.emit(event, ...data),
}

Object.freeze(EventRegistry);
export default EventRegistry;