import { CursorPositionType } from "../CursorPositionType";
import { IControl } from "../IControl";

export class MoveControl implements IControl {
    constructor(
        readonly type: CursorPositionType,
        readonly boundGetter: () => { x: number; y: number; w: number; h: number; },
        readonly mover: (dx: number, dy: number) => void
    ) { }
    renderControl(ctx: CanvasRenderingContext2D): void {
        // not render
    }

    include(x: number, y: number): boolean {
        const bound = this.boundGetter();
        let x1 = bound.x;
        let x2 = bound.x + bound.w;
        if (x2 < x1) {
            const tmp = x1;
            x1 = x2;
            x2 = tmp;
        }

        let y1 = bound.y;
        let y2 = bound.y + bound.h;
        if (y2 < y1) {
            const tmp = y1;
            y1 = y2;
            y2 = tmp;
        }

        if (x1 <= x && x <= x2 && y1 <= y && y <= y2) {
            return true;
        }
        return false;
    }
    notifyMove(dx: number, dy: number) {
        this.mover(dx, dy);
    }
}
