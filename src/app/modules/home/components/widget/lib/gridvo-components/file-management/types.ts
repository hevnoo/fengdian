export interface FormList {
    formControlName: string,
    label: string,
    type: FormListType,
    placeholder?: string,
    errorTip?: string
    disabled?: boolean
}

export enum FormListType {
    "TEXT" = "TEXT"
}

export interface ButtonList {
    label: string,
    icon: string,
    clickEvent: Function,
    show: boolean
}

export interface FileResponese {
    is_dir: boolean,
    md5: string,
    mtime: number,
    name: string,
    path: string,
    size: number,
    parentNode?: any,
    [prop: string]: any
}

export interface FileInfo {
    md5: string,
    name: string,
    offset: number,
    path: string,
    rename: string,
    scene: string,
    size: number,
    timeStamp: number,
    [prop: string]: any
}

export enum ModalTitleEnum {
    "文件信息" = "文件信息",
    "文件上传" = "文件上传",
}

export interface TableData {
    fileName: string,
    fileType: string,
    path: string,
    time: number,
    origin: any,
    size: number,
    [prop: string]: any
}

export interface TableHeader {
    prop: string,
    label: string,
    width?: string,
    ellipsis?: boolean,
    formatter?: (prop: any) => any
}