import { CursorPositionType } from "../CursorPositionType";
import { IControl } from "../IControl";

export class ResizeControl implements IControl {
    private readonly controlRadius = 6;
    constructor(
        readonly type: CursorPositionType,
        private readonly xGetter: () => number,
        private readonly yGetter: () => number,
        private readonly resizer: (dx: number, dy: number) => void,
        private readonly enabled: () => boolean = () => true
    ) { }
    renderControl(ctx: CanvasRenderingContext2D): void {
        if (!this.enabled()) {
            return;
        }
        ctx.strokeStyle = 'white'
        ctx.fillStyle = '#6CBAD8';
        ctx.beginPath();
        ctx.arc(this.xGetter(), this.yGetter(), this.controlRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath()
        ctx.arc(this.xGetter(), this.yGetter(), this.controlRadius, 0, 2 * Math.PI);
        ctx.stroke()
    }

    include(x: number, y: number): boolean {
        if (!this.enabled()) {
            return false;
        }
        const x1 = this.xGetter() - this.controlRadius;
        const x2 = this.xGetter() + this.controlRadius;
        const y1 = this.yGetter() - this.controlRadius;
        const y2 = this.yGetter() + this.controlRadius;
        return (x1 <= x && x <= x2 && y1 <= y && y <= y2);
    }

    notifyMove(dx: number, dy: number) {
        this.resizer(dx, dy);
    }
}
