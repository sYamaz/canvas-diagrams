import { Rect } from './datatypes/Rect';
import { CustomPointerEvent } from './datatypes/PointerEvent';
import { TypedEvent } from './datatypes/TypedEvent';


export interface ILayerStack {
    onRenderRequested: TypedEvent<void>;
    getBoundRect(): Rect;
    receivePointerDownEvent(ev: CustomPointerEvent): void;
    receivePointerMoveEvent(ev: CustomPointerEvent): void;
    receivePointerUpEvent(ev: CustomPointerEvent): void;
    render(ctx: CanvasRenderingContext2D): void;
}
