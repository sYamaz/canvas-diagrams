import { Point } from "./Point";

export interface Rect {
    left:number,
    top:number,
    width:number,
    height:number,

    include(p: Point):boolean
}