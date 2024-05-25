import { Rect } from './datatypes/Rect';
import { CustomKeyboardEvent, CustomMouseEvent, CustomPointerEvent } from './datatypes/PointerEvent';
import { TypedEvent } from './datatypes/TypedEvent';
import { TextEditEndEvent, TextEditEnterEvent } from './datatypes/TextEditEvent';


export interface ILayerStack {
    onRenderRequested: TypedEvent<void>;
    onEnterEditing: TypedEvent<TextEditEnterEvent>;
    onEndEdit: TypedEvent<TextEditEndEvent>;
    getBoundRect(): Rect;
    receivePointerDownEvent(ev: CustomPointerEvent): void;
    receivePointerMoveEvent(ev: CustomPointerEvent): void;
    receivePointerUpEvent(ev: CustomPointerEvent): void;
    receiveDoubleClickEvent(ev: CustomMouseEvent): void;
    receiveKeyEvent(ev: CustomKeyboardEvent): void
    render(ctx: CanvasRenderingContext2D): void;
}
