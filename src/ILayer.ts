import { CustomKeyboardEvent, CustomMouseEvent, CustomPointerEvent } from "./datatypes/PointerEvent";
import { TextEditEndEvent, TextEditEnterEvent } from "./datatypes/TextEditEvent";
import { TypedEvent } from "./datatypes/TypedEvent";


export interface ILayer {
    receivePointerDownEvent(ev: CustomPointerEvent): void;
    receivePointerUpEvent(ev: CustomPointerEvent): void;
    receivePointerMoveEvent(ev: CustomPointerEvent): void;
    receiveDoubleClickEvent(ev: CustomMouseEvent): void;
    receiveKeyEvent(ev: CustomKeyboardEvent): void
    render(ctx: CanvasRenderingContext2D): void;
    resetObjectState():void
    onRenderRequested: TypedEvent<void>;
    onEnterEditing: TypedEvent<TextEditEnterEvent>
    onEndEdit: TypedEvent<TextEditEndEvent>;
}
