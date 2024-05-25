import { CustomKeyboardEvent, CustomMouseEvent, CustomPointerEvent } from "./datatypes/PointerEvent";
import { TextEditEndEvent, TextEditEnterEvent } from "./datatypes/TextEditEvent";


export interface IObjectData {
    type: string;
    selected: boolean;
    isDragging(): boolean;
    /**
     * pointerdownイベントを通知します。
     * @param ev
     */
    pointerDown(ev: CustomPointerEvent, option?: {
        onEndEdit?: (ev: TextEditEndEvent) => void
    }): void;
    /**
     * pointermoveイベントを通知します
     * @param ev
     */
    pointerMove(ev: CustomPointerEvent): void;
    /**
     * pointerupイベントを通知します
     * @param ev
     */
    pointerUp(ev: CustomPointerEvent): void;
    /**
     * doubleclickイベントを通知します
     * @param ev 
     */
    doubleclick(ev: CustomMouseEvent, option?: {
        onEnterEditing?: (ev: TextEditEnterEvent) => void
    }): void;
    /**
     * keyboardイベントを通知します
     * @param ev 
     */
    keyInput(ev:CustomKeyboardEvent): void
    /**
     * 一時的な状態（hoverやselected)をクリアします
     */
    clearState(): void;

    render(ctx: CanvasRenderingContext2D): void
}
