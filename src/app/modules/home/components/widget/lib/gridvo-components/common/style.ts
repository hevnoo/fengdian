export class NzModalStyle {
    constructor() {}

    private _wrapClassNameMap: Map<string, string> = new Map()
    .set('defaultStyle', 'light-style')
    .set('blackStyle', 'black-style')
    .set('lightStyle', 'light-style')

    get wrapClassNameMap() {
        return this._wrapClassNameMap
    }

    getNzWrapClassName(className: string): string {
        const style = this._wrapClassNameMap.get(className)
        return !!style ? style : this._wrapClassNameMap.get("defaultStyle")
    }
}