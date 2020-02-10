declare class Storage<iStorage> {
    isPathExists(_path: string): Promise<unknown>;
    isFileExists(_path: string, _file?: string): Promise<unknown>;
    append(_path: string, fileName: string, json: object): Promise<unknown>;
    set(_path: string, fileName: string, json: object): Promise<unknown>;
    get(_path: string, _file: string, key: string): Promise<unknown>;
}
declare const _default: Storage<unknown>;
export default _default;
