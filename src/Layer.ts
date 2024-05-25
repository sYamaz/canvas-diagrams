import { DataModel } from "./DataModel";
import { ILayer } from "./ILayer";
import { ToolManager } from "./ToolManager";
import { CustomKeyboardEvent, CustomMouseEvent, CustomPointerEvent } from "./datatypes/PointerEvent";
import { TextEditEndEvent, TextEditEnterEvent } from "./datatypes/TextEditEvent";
import { TypedEvent } from "./datatypes/TypedEvent";

export class Layer implements ILayer {

    readonly onRenderRequested = new TypedEvent<void>
    readonly onEnterEditing = new TypedEvent<TextEditEnterEvent>
    readonly onEndEditing = new TypedEvent<TextEditEndEvent>
    readonly onEndEdit = new TypedEvent<TextEditEndEvent>()
    constructor(private readonly layerIndex:number, private readonly toolManager: ToolManager, private readonly dataModel: DataModel){
    }


    render(ctx: CanvasRenderingContext2D) {
        this.dataModel.getLayerObjects(this.layerIndex).forEach(obj => {
            this.toolManager.getTool(obj.type)?.renderObject(ctx, obj)
        })
    }

    receiveKeyEvent(ev: CustomKeyboardEvent): void {
        const currentTool = this.toolManager.getCurrentTool()
        if(currentTool) { // tool選択時のキー入力は今のところ用途が無い
            return
        }

        this.dataModel.getLayerObjects(this.layerIndex).forEach(obj => {
            obj.keyInput(ev)
        })
    }

    receiveDoubleClickEvent(ev: CustomMouseEvent): void {
        const currentTool = this.toolManager.getCurrentTool()
        if(currentTool) { // tool選択時のダブルクリックは今のところ用途が無い
            return
        }

        this.dataModel.getLayerObjects(this.layerIndex).forEach(obj => {
            obj.doubleclick(ev, {
                onEnterEditing: (ev) => {
                    this.onEnterEditing.emit(ev)
                },
            })
        })
    }

    receivePointerDownEvent(ev: CustomPointerEvent): void {
        const currentTool = this.toolManager.getCurrentTool()
        if(currentTool) { // toolが選択されてればそれを優先
            currentTool.pointerDown(ev)
            if(ev.used) {
                this.onRenderRequested.emit()
            }
            return
        }

        this.dataModel.getLayerObjects(this.layerIndex).forEach(obj => {
            obj.pointerDown(ev, {
                onEndEdit: (ev) => {
                    this.onEndEdit.emit(ev)
                }
            })
        })
        
        this.onRenderRequested.emit()
    }
    receivePointerUpEvent(ev: CustomPointerEvent): void {
        const currentTool = this.toolManager.getCurrentTool()
        if(currentTool) { // toolが選択されていればそれを優先
            currentTool.pointerUp(ev)
            if(ev.used) {
                this.onRenderRequested.emit()
            }
            return
        }

        this.dataModel.getLayerObjects(this.layerIndex).forEach(obj => {
            obj.pointerUp(ev)
        })
        this.onRenderRequested.emit()
    }
    receivePointerMoveEvent(ev: CustomPointerEvent): void {
        const currentTool = this.toolManager.getCurrentTool()
        if(currentTool) { // toolが選択されていればそれを優先
            currentTool.pointerMove(ev)
            if(ev.used) {
                this.onRenderRequested.emit()
            }
            return
        }

        // draggingとhoverではdraggingを優先するため、sortで先頭に持ってくるようにする
        this.dataModel.getLayerObjects(this.layerIndex).sort((left, right) => {
            if(left.isDragging() && right.isDragging()) {
                return 0
            } else if(left.isDragging()) {
                return -1
            } else if (right.isDragging()) {
                return 1
            } else {
                return 0
            }
        }).forEach(obj => {
            obj.pointerMove(ev)
        })

        this.onRenderRequested.emit()
    }

    resetObjectState() {
        this.dataModel.getLayerObjects(this.layerIndex).forEach(obj => {
            obj.clearState()
        })
    }
}