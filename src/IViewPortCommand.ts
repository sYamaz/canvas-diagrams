import { TextEditEndEvent, TextEditEnterEvent } from "./datatypes/TextEditEvent";
import { TypedEvent } from "./datatypes/TypedEvent";




export interface IViewPortCommand {
    receiveWheelEvent(ev: WheelEvent): void;
    receivePointerDownEvent(ev: PointerEvent): void;
    receivePointerUpEvent(ev: PointerEvent): void;
    receivePointerMoveEvent(ev: PointerEvent): void;
    receiveDoubleClickEvent(ev: MouseEvent): void
    receiveKeyEvent(ev: KeyboardEvent): void
    onRenderRequested: TypedEvent<void>;
    onEnterEditing: TypedEvent<TextEditEnterEvent>
    onEndEdit: TypedEvent<TextEditEndEvent>;
}
