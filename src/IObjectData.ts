import { CustomPointerEvent } from "./datatypes/PointerEvent";


export interface IObjectData {
    type: string;
    selected: boolean;
    isDragging(): boolean;
    /**
     * pointerdownイベントを通知します。
     * @param ev
     */
    pointerDown(ev: CustomPointerEvent): void;
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
     * 一時的な状態（hoverやselected)をクリアします
     */
    clearState(): void;

    render(ctx: CanvasRenderingContext2D): void
}
