import { Diagram } from "./Diagram"
import { Layer } from "./Layer"
import { LayerStack } from "./LayerStack"
import { DiagramViewPort } from "./DiagramViewPort"
import { DataModel } from "./DataModel"
import { ITool } from "./ITool"
import { StrokeTool } from "./tools/Stroke"
import { RectangleTool } from "./tools/Rectangle"
import { ToolManager } from "./ToolManager"

export const createDiagram = (canvas: HTMLCanvasElement) => {
    console.log("createDiagram called.")
    const dataModel = new DataModel()
    const toolManager = new ToolManager([])
    const tools: ITool[] = [
        new RectangleTool(dataModel, toolManager),
        new StrokeTool(dataModel)
    ]

    tools.forEach(tool => {
        toolManager.addTool(tool)
    })

    toolManager.selectTool('rectangle')
    const layerStack = new LayerStack([new Layer(0, toolManager, dataModel)], toolManager)
    const vp = new DiagramViewPort(layerStack)
    const observer = new Diagram(canvas, vp, vp)
    return {
        useRectangle: () => toolManager.selectTool('rectangle'),
        useStroke: () => toolManager.selectTool('stroke')
    }
}