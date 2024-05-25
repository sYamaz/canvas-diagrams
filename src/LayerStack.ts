import { ILayer } from "./ILayer";
import { ILayerStack } from "./ILayerStack";
import { ToolManager } from "./ToolManager";
import { Point } from "./datatypes/Point";
import { CustomKeyboardEvent, CustomMouseEvent, CustomPointerEvent } from "./datatypes/PointerEvent";
import { Rect } from "./datatypes/Rect";
import { TextEditEndEvent, TextEditEnterEvent } from "./datatypes/TextEditEvent";
import { TypedEvent } from "./datatypes/TypedEvent";

class BgRectangle implements Rect {
    left: number;
    top: number;
    width: number;
    height: number;
    include(p: Point): boolean {
        if (p.x < this.left || this.left + this.width < p.x) {
            return false
        }
        if (p.y < this.top || this.top + this.height < p.y) {
            return false
        }
        return true
    }

    constructor() {
        this.left = 0
        this.top = 0
        this.width = 1000
        this.height = 700
    }
}

export class LayerStack implements ILayerStack {

    private layers: ILayer[]
    private selectedLayer = 0

    readonly onRenderRequested = new TypedEvent<void>()
    readonly onEnterEditing = new TypedEvent<TextEditEnterEvent>()
    readonly onEndEdit = new TypedEvent<TextEditEndEvent>()
    constructor(defaultLayers: ILayer[], private readonly toolManager: ToolManager) {
        this.layers = defaultLayers
        // renderRequestedの伝搬
        this.layers.forEach(layer => {
            layer.onRenderRequested.on(() => {
                this.onRenderRequested.emit()
            })

            layer.onEnterEditing.on((ev) => {
                this.onEnterEditing.emit(ev)
            })

            layer.onEndEdit.on((ev) => {
                this.onEndEdit.emit(ev)
            })
        })

        this.toolManager.onToolChanged.on(_ => {
            this.layers.forEach(layer => layer.resetObjectState())
            this.onRenderRequested.emit()
        })
    }
    

    receiveKeyEvent(ev: CustomKeyboardEvent): void {
        this.layers[this.selectedLayer].receiveKeyEvent(ev)
    }

    receiveDoubleClickEvent(ev: CustomMouseEvent): void {
        this.layers[this.selectedLayer].receiveDoubleClickEvent(ev)
    }

    receivePointerDownEvent(ev: CustomPointerEvent): void {
        this.layers[this.selectedLayer].receivePointerDownEvent(ev)
    }
    receivePointerMoveEvent(ev: CustomPointerEvent): void {
        this.layers[this.selectedLayer].receivePointerMoveEvent(ev)
    }
    receivePointerUpEvent(ev: CustomPointerEvent): void {
        this.layers[this.selectedLayer].receivePointerUpEvent(ev)
    }
    render(ctx: CanvasRenderingContext2D) {
        // ツール選択中はカーソルをデフォルトから変更する
        if(this.toolManager.getCurrentTool()) {
            ctx.canvas.style.cursor = 'crosshair'
        }

        this.layers.forEach((l) => l.render(ctx))
    }
    getBoundRect(): Rect {
        return new BgRectangle()
    }
}