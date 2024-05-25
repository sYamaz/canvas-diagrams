import { ITextEditor } from "./ITextEditor";

export interface TextEditEnterEvent {
    x: number;
    y: number;
    width: number
    target: ITextEditor
}

export interface TextEditEndEvent {
    target: ITextEditor
}