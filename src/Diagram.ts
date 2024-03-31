import { IViewPortCommand } from "./IViewPortCommand"
import { IViewPortQuery } from "./IViewPortQuery"
import { ToolManager } from "./ToolManager"



export class Diagram {
    private readonly vpCommand: IViewPortCommand
    private readonly vpQuery: IViewPortQuery
    private readonly canvasElement: HTMLCanvasElement
    constructor(canvasElement: HTMLCanvasElement, vpCommand: IViewPortCommand, vpQuery: IViewPortQuery) {
        this.vpCommand = vpCommand
        this.vpQuery = vpQuery

        this.canvasElement = canvasElement


        /** this.vpCommandがundefinedになる問題がある */
        // this.canvasElement.onwheel = this.onWheel
        // this.canvasElement.onpointerdown = this.onPointerDown
        // this.canvasElement.onpointermove = this.onPointerMove
        // this.canvasElement.onpointerup = this.onPointerUp


        const render = () => {
            // cursorの初期化
            this.canvasElement.style.cursor = 'default'

            
            const context = this.canvasElement.getContext("2d")!
            context.reset()
            // context.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height)
            this.vpQuery.render(context)
        }

        this.canvasElement.addEventListener('pointerup', (ev) => {
            this.vpCommand.receivePointerUpEvent(ev)
        })
        this.canvasElement.addEventListener('pointerdown', (ev) => {
            this.vpCommand.receivePointerDownEvent(ev)
        })
        this.canvasElement.addEventListener('wheel', (ev) => {
            vpCommand.receiveWheelEvent(ev)
        })
        this.canvasElement.addEventListener('pointermove', (ev) => {
            vpCommand.receivePointerMoveEvent(ev)
        })

        this.vpCommand.onRenderRequested.on(render)
    }
}