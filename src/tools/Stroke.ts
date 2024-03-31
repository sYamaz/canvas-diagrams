
import { ITool } from "../ITool";
import { CustomPointerEvent } from "../datatypes/PointerEvent";
import { DataModel } from "../DataModel"
import { IObjectData } from "../IObjectData";

interface StrokePoint {
    pressure: number
    x: number
    y: number
    timestamp:number
}

class StrokeObject implements IObjectData {
    render(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 0.5

        if(this.points.length > 1) {
            ctx.moveTo(this.points[0].x, this.points[0].y)
            for(let i = 1; i < this.points.length; i++) {
                ctx.lineTo(this.points[i].x, this.points[i].y)
            }
            ctx.stroke()
        }
    }
    isDragging(): boolean {
        return false
    }
    clearState(): void {
        return
    }
    pointerUp(_: CustomPointerEvent): void {
        return
    }
    pointerDown(_: CustomPointerEvent): void {
        return
    }
    pointerMove(_: CustomPointerEvent): void {
        return
    }
    selected: boolean = false
    hover: boolean = false
    type: string = "stroke"
    points: StrokePoint[] = []
    fixed: boolean = false
}

export class StrokeTool implements ITool {
    private currentStroke: StrokeObject = new StrokeObject()
    readonly type: string = "stroke"
    constructor(private readonly dataModel: DataModel) {

    }
    renderObject(ctx: CanvasRenderingContext2D, object: IObjectData) {
        const stroke = object as StrokeObject
        stroke.render(ctx)
    }
    private convertEventToStrokePoint(ev:CustomPointerEvent): StrokePoint {
        return {
            pressure: ev.pressure,
            x: ev.x,
            y: ev.y,
            timestamp: ev.timestamp
        }
    }

    pointerDown(ev: CustomPointerEvent): void {
        const point:StrokePoint = this.convertEventToStrokePoint(ev)
        this.currentStroke = new StrokeObject()
        this.currentStroke.points.push(point)
        const uuid = this.dataModel.createObject(0, this.currentStroke)
        ev.used = true
    }
    pointerUp(ev: CustomPointerEvent): void {
        if (this.currentStroke.points.length === 0) {
            return
        }

        const point:StrokePoint = this.convertEventToStrokePoint(ev)
        this.currentStroke.points.push(point)
        this.currentStroke.fixed = true
        ev.used = true
    }
    pointerMove(ev: CustomPointerEvent): void {
        if (this.currentStroke.points.length === 0) {
            return
        }
        if(this.currentStroke.fixed) {
            return
        }

        const point:StrokePoint = this.convertEventToStrokePoint(ev)
        this.currentStroke.points.push(point)
        ev.used = true
        
        return
    }
}