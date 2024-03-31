import { IViewPortQuery } from "./IViewPortQuery";
import { IViewPortCommand } from "./IViewPortCommand";
import {CustomPointerEvent} from './datatypes/PointerEvent'
import { TypedEvent } from './datatypes/TypedEvent';
import { ILayerStack } from "./ILayerStack";

export class DiagramViewPort implements IViewPortCommand, IViewPortQuery {
    private readonly layerStack: ILayerStack
    private isRendering = false
    private transform: number[] = [
        1, // a/m11 水平方向への拡大
        0, // b/m12 水平方向への歪み
        0, // c/m21 垂直方向への歪み
        1, // d/m22 垂直方向への拡大
        0, // e/dx 水平移動
        0, // f/dy 垂直移動
    ]
    readonly onRenderRequested:TypedEvent<void> = new TypedEvent()

    constructor(layerStack: ILayerStack) {
        this.layerStack = layerStack
        this.layerStack.onRenderRequested.on(() => {
            this.onRenderRequested.emit()
        })
    }

    // viewport上の座標を絶対座標に変換する
    private convertRelX2AbsX(rel: {x:number, y:number}): {x:number, y:number} {
        // const x = rel.x * this.transform[0] + rel.y * this.transform[2] + this.transform[4]
        // const y = rel.x * this.transform[1] + rel.y * this.transform[3] + this.transform[5]
        const x = (rel.x - this.transform[4]) / this.transform[0]
        const y = (rel.y - this.transform[5]) / this.transform[3]
        return {x, y}
    }

    // 入力時にviewpoirt上で発生したpointerEventをから絶対座標のものに変換する
    private convertEventToAbsolute(relative: PointerEvent): CustomPointerEvent {
        const {x, y} = this.convertRelX2AbsX({x: relative.offsetX, y: relative.offsetY})
        return {
            pressure: relative.pressure,
            x, y,
            timestamp: relative.timeStamp,
            used: false
        }
    }

    receivePointerDownEvent(ev: PointerEvent): void {
        // convert ev with transform
        const absEv = this.convertEventToAbsolute(ev)

        this.layerStack.receivePointerDownEvent(absEv)
    }

    receivePointerUpEvent(ev: PointerEvent): void {

        const absEv = this.convertEventToAbsolute(ev)

        const result = this.layerStack.receivePointerUpEvent(absEv)
    }

    receivePointerMoveEvent(ev: PointerEvent): void {
        // console.log(ev.pointerId)

        // console.log("receivePointerMoveEvent", ev)

        const absEv = this.convertEventToAbsolute(ev)
        this.layerStack.receivePointerMoveEvent(absEv)
    }

    render(ctx: CanvasRenderingContext2D): void {
        if(!this.isRendering){
            this.isRendering = true
            ctx.setTransform(this.transform[0], this.transform[1], this.transform[2], this.transform[3], this.transform[4], this.transform[5])
            this.layerStack.render(ctx)
            this.isRendering = false
        }
    }
    

    /**
     * wheel eventはどう考えてもviewPoirtにしか作用しないので分離
     * @param ev 
     */
    receiveWheelEvent(ev: WheelEvent): void {
        const dxIndex = 4
        const dyIndex = 5

        const x = this.transform[dxIndex]
        this.transform[dxIndex] = x - ev.deltaX 
        const y = this.transform[dyIndex]
        this.transform[dyIndex] = y - ev.deltaY 

        if (this.transform[dxIndex] < -250) {
            this.transform[dxIndex] = -250
        }
        if (this.transform[dxIndex] > 250) {
            this.transform[dxIndex] = 250
        }
        if(this.transform[dyIndex] < -250) {
            this.transform[dyIndex] = -250
        }
        if(this.transform[dyIndex] > 250) {
            this.transform[dyIndex] = 250
        }
        this.onRenderRequested.emit()
    }
}