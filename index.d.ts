declare type TDictionary<T> = {
    [key: string]: T;
};
declare enum EDataType {
    STRING = 0,
    INTEGER = 1,
    FLOAT = 2,
    BOOLEAN = 3,
    FLAG = 4
}
interface IParamInfo {
    type: EDataType;
    required?: boolean;
    alias?: string;
}
declare type TParamOptions = IParamInfo | EDataType | string;
declare type TParamOptionDictionary = TDictionary<TParamOptions>;
interface ICommnadLineArgs {
    _node: string;
    _entry: string;
    _unknows?: string[];
    _missing?: string[];
    _faileds?: string[];
    _length?: number;
    [inx: number]: any;
    [key: string]: any;
}
declare type TCommadLineFunction = (options: TParamOptionDictionary) => ICommnadLineArgs;
interface ICommandLine extends TCommadLineFunction, Record<keyof typeof EDataType, EDataType> {
}
declare const _default: ICommandLine;
export default _default;
