import { IViewPortCommand } from "./IViewPortCommand"
import { IViewPortQuery } from "./IViewPortQuery"
import { TextEditEndEvent, TextEditEnterEvent } from "./datatypes/TextEditEvent"



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
        const divId = "canvas-diagrams-text-editor"
        const showEditor = (ev: TextEditEnterEvent) => {
            const div = document.createElement('div')
            div.id = divId

            div.contentEditable = 'true'
            div.style.minHeight = '1em'
            div.style.lineHeight = '1.2'
            div.style.fontWeight = 'normal'
            div.style.fontSize = '12px'
            div.style.zIndex = '1'
            div.style.color = 'rgb(0,0,0)'
            div.style.border = '1px solid transparent'
            div.style.textAlign = 'left'
            div.style.left = `${this.canvasElement.offsetLeft + ev.x}px`
            div.style.top = `${this.canvasElement.offsetTop +ev.y}px`
            div.style.overflowWrap = 'normal'
            div.style.whiteSpace = 'normal'
            div.style.maxWidth = `${ev.width}px`
            div.style.transformOrigin = '0px 0px'
            div.style.position = 'absolute'
            div.style.overflow = 'visible'
            div.style.width = 'fit-content'
            div.style.display = 'block'
            div.innerHTML = ev.target.getText()

            document.body.appendChild(div)
            div.focus()
        }

        const endEdit = (ev: TextEditEndEvent) => {
            const element = document.getElementById(divId)
            if(element) {
                ev.target.setText(element.innerHTML)
                element.parentElement?.removeChild(element)
            }
        }

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
        this.canvasElement.addEventListener('dblclick', (ev) => {
            vpCommand.receiveDoubleClickEvent(ev)
        })

        /** keyイベントを受け付けさせるためにtabIndexを設定する */
        this.canvasElement.tabIndex = 0
        this.canvasElement.addEventListener('keydown', (ev) => {
            vpCommand.receiveKeyEvent(ev)
        })

        this.vpCommand.onRenderRequested.on(render)
        this.vpCommand.onEnterEditing.on(showEditor)
        this.vpCommand.onEndEdit.on(endEdit)
    }
}