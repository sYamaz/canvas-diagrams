import { CursorPositionType } from "./CursorPositionType";

export interface IControl {
    type: CursorPositionType;
    include(x: number, y: number): boolean;
    notifyMove(dx: number, dy: number): void;
    renderControl(ctx: CanvasRenderingContext2D): void;
}
