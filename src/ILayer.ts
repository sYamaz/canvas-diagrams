import { CustomPointerEvent } from "./datatypes/PointerEvent";
import { TypedEvent } from "./datatypes/TypedEvent";


export interface ILayer {
    receivePointerDownEvent(ev: CustomPointerEvent): void;
    receivePointerUpEvent(ev: CustomPointerEvent): void;
    receivePointerMoveEvent(ev: CustomPointerEvent): void;
    render(ctx: CanvasRenderingContext2D): void;
    resetObjectState():void
    onRenderRequested: TypedEvent<void>;
}
