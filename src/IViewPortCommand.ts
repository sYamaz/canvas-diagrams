import { TypedEvent } from "./datatypes/TypedEvent";




export interface IViewPortCommand {
    receiveWheelEvent(ev: WheelEvent): void;
    receivePointerDownEvent(ev: PointerEvent): void;
    receivePointerUpEvent(ev: PointerEvent): void;
    receivePointerMoveEvent(ev: PointerEvent): void;
    onRenderRequested: TypedEvent<void>;
}
