import { DataModel } from "../DataModel";
import { IObjectData } from "../IObjectData";
import { ITool } from "../ITool";
import { ToolManager } from "../ToolManager";
import { CustomKeyboardEvent, CustomMouseEvent, CustomPointerEvent } from "../datatypes/PointerEvent";
import { CursorPositionType } from "./CursorPositionType";
import { IControl } from "./IControl";
import { ResizeControl } from "./controls/ResizeControl";
import { MoveControl } from "./controls/MoveControl";
import { ITextEditor } from "../datatypes/ITextEditor";
import { TextEditEndEvent, TextEditEnterEvent } from "../datatypes/TextEditEvent";

const posTypeToCursor = new Map<CursorPositionType, string>([
    ['topLeft', "nw-resize"],
    ['bottomLeft', 'sw-resize'],
    ['bottomRight', 'se-resize'],
    ['topRight', 'ne-resize'],
    // ['none', 'default'],
    ['left', 'w-resize'],
    ['top', 'n-resize'],
    ['right', 'e-resize'],
    ['bottom', 's-resize'],
    ['center', 'move']
])

class RectangleObject implements IObjectData, ITextEditor {
    // 永続化対象の状態
    type: string = "rectangle"
    x: number = 0
    y: number = 0
    width: number = 0
    height: number = 0
    strokeWidth: number = 1
    strokeStyle: string = 'black'
    fillStyle: string = 'transparent'

    fixed: boolean = false
    // 一時的な状態
    editing: boolean = false
    selected: boolean = false
    hoverType: CursorPositionType = 'none'
    draggingType: CursorPositionType = 'none'
    dragFromX: number = -1
    dragFromY: number = -1
    editCell?: HTMLDivElement

    text: string = ""

    private readonly controls: IControl[]
    constructor() {
        this.controls = [
            new ResizeControl('topLeft', () => this.x, () => this.y, (dx, dy) => {
                this.x += dx
                this.y += dy
                this.width += -dx
                this.height += -dy
            }, () => this.selected),
            new ResizeControl('topRight', () => this.x + this.width, () => this.y, (dx, dy) => {
                this.y += dy
                this.width += dx
                this.height += -dy
            }, () => this.selected),
            new ResizeControl('bottomLeft', () => this.x, () => this.y + this.height, (dx, dy) => {
                this.x += dx
                this.width += -dx
                this.height += dy
            }, () => this.selected),
            new ResizeControl('bottomRight', () => this.x + this.width, () => this.y + this.height, (dx, dy) => {
                this.width += dx
                this.height += dy
            }, () => this.selected),
            new ResizeControl('left', () => this.x, () => this.y + this.height / 2, (dx, _) => {
                this.x += dx
                this.width += -dx
            }, () => this.selected),
            new ResizeControl('right', () => this.x + this.width, () => this.y + this.height / 2, (dx, _) => {
                this.width += dx
            }, () => this.selected),
            new ResizeControl('top', () => this.x + this.width / 2, () => this.y, (_, dy) => {
                this.y += dy
                this.height += -dy
            }, () => this.selected),
            new ResizeControl('bottom', () => this.x + this.width / 2, () => this.y + this.height, (_, dy) => {
                this.height += +dy
            }, () => this.selected),

            // last
            new MoveControl('center', () => {
                return {
                    x: this.x,
                    y: this.y,
                    w: this.width,
                    h: this.height
                }
            }, (dx, dy) => {
                this.x += dx
                this.y += dy
            })
        ]
    }
    setText(html: string): void {
        this.text = html
    }
    getText(): string {
        return this.text
    }

    isDragging(): boolean {
        return this.draggingType != 'none'
    }

    clearState(): void {
        this.hoverType = 'none'
        this.selected = false
        this.draggingType = 'none'
    }
    pointerDown(ev: CustomPointerEvent, option?: {
        onEndEdit?: (ev: TextEditEndEvent) => void
    }) {
        // イベントが消費済みだったらreturn
        if (ev.used) {
            this.selected = false
            this.draggingType = 'none'
            this.endEdit()

            if (option) {
                if(option.onEndEdit) {
                    option.onEndEdit({
                        target: this
                    })
                }
            }

            return
        }

        if (this.hoverType === 'none') {
            this.selected = false
            this.draggingType = 'none'
            this.endEdit()

            if (option) {
                if(option.onEndEdit) {
                    option.onEndEdit({
                        target: this
                    })
                }
            }
        } else {
            // center以外はすでにslected=trueになっているはず
            this.selected = true
            this.draggingType = this.hoverType
            this.dragFromX = ev.x
            this.dragFromY = ev.y
            ev.used = true
        }
    }
    pointerMove(ev: CustomPointerEvent): void {
        this.hoverType = 'none'
        // イベントが消費済みだったらreturn
        if (ev.used) {
            return
        }

        const ctrl = this.controls.find(control => control.include(ev.x, ev.y))
        if (ctrl) {
            this.hoverType = ctrl.type
            ev.used = true
        } 

        if (this.draggingType !== 'none') {
            const ctrl = this.controls.find(control => control.type === this.draggingType)
            if (ctrl) {
                ctrl.notifyMove(ev.x - this.dragFromX, ev.y - this.dragFromY)
                this.dragFromX = ev.x
                this.dragFromY = ev.y
            }
        }
    }
    pointerUp(ev: CustomPointerEvent): void {
        this.draggingType = 'none'
        this.dragFromX = -1
        this.dragFromY = -1
    }

    doubleclick(ev: CustomMouseEvent, option?: {
        onEnterEditing?: (ev: TextEditEnterEvent) => void
    }): void {
        if(!this.controls.some(control => control.include(ev.x, ev.y))) {
            return
        }
        if (!this.editing) {
            if (option) {
                if (option.onEnterEditing) {
                    option.onEnterEditing({
                        width: this.width,
                        x: this.x,
                        y: this.y,
                        target: this
                    })
                    this.editing = true
                }
            }
        }
    }


    private endEdit() {
        this.editing = false
    }

    keyInput(ev: CustomKeyboardEvent): void {
        if (this.selected && !this.editing) {
            switch (ev.key) {
                case 'ArrowRight':
                    this.x += 10
                    break
                case 'ArrowLeft':
                    this.x -= 10
                    break
                case 'ArrowUp':
                    this.y += 10
                    break
                case 'ArrowDown':
                    this.y -= 10
                    break
                default:
                    break
            }
        }

        if (this.editing && ev.key === 'Escape') {
            this.endEdit()
        }
    }

    render(ctx: CanvasRenderingContext2D): void {
        // draw self
        ctx.lineWidth = this.strokeWidth
        ctx.strokeStyle = this.strokeStyle
        ctx.fillStyle = this.fillStyle
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.strokeRect(this.x, this.y, this.width, this.height)
        console.log(this.text, this.x, this.y, ctx.font)
        
        const cacheFillStyle = ctx.fillStyle
        ctx.fillStyle = 'black'
        ctx.fillText(this.text, this.x, this.y + 10)
        ctx.fillStyle = cacheFillStyle
        // change mouse cursor
        const cursor = posTypeToCursor.get(this.hoverType)
        if (cursor) {
            ctx.canvas.style.cursor = cursor
        }

        // draw hover effects
        if (this.hoverType !== 'none') {
            ctx.strokeStyle = '#6CBAD8'
            ctx.setLineDash([4, 2])
            ctx.strokeRect(this.x, this.y, this.width, this.height)
            ctx.setLineDash([])
        }

        // draw controls if needed
        this.controls.forEach(control => control.renderControl(ctx))
    }
}

export class RectangleTool implements ITool {
    readonly type: string = "rectangle"
    private current: RectangleObject = new RectangleObject()
    constructor(private readonly dataModel: DataModel, private readonly toolManager: ToolManager) {

    }
    renderObject(ctx: CanvasRenderingContext2D, object: IObjectData) {
        const rect = object as RectangleObject
        rect.render(ctx)
    }
    pointerDown(ev: CustomPointerEvent): void {
        this.current = new RectangleObject()
        this.current.x = ev.x
        this.current.y = ev.y
        const uuid = this.dataModel.createObject(0, this.current)
        ev.used = true
    }
    pointerUp(ev: CustomPointerEvent): void {
        this.current.width = ev.x - this.current.x
        this.current.height = ev.y - this.current.y
        this.current.fixed = true

        this.toolManager.selectTool('')
        ev.used = true
    }
    pointerMove(ev: CustomPointerEvent): void {
        if (this.current.fixed) {
            return
        }
        this.current.width = ev.x - this.current.x
        this.current.height = ev.y - this.current.y
        ev.used = true
        return
    }

}