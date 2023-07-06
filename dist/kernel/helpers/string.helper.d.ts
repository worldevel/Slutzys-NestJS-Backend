import * as mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
export declare const getExt: (path: string) => string;
export declare const getContentType: (ext: string) => any;
export declare const isEmail: (text: string) => boolean;
export declare const generateUuid: () => string;
export declare const getFileName: (fullPath: string, removeExtension: boolean) => string;
export declare const getFilePath: (fullPath: any) => any;
export declare const randomString: (len: number, charSetInput?: string) => string;
export declare const isUrl: (str: string) => boolean;
export declare const replaceSpecialChars: (str: string, char?: string) => string;
export declare const createAlias: (str: string) => string;
export declare const truncate: (str: string, length?: number) => string;
export declare const stripTags: (input: string, allowed?: string) => string;
export declare const removeScriptTag: (input: string) => string;
export declare const updateQueryStringParameter: (uri: string, key: string, value: string) => string;
export declare const isObjectId: (id: string) => boolean;
export declare const toObjectId: (id: string | ObjectId) => mongoose.Types.ObjectId;
