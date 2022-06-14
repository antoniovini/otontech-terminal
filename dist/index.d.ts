interface ScanParams {
    label: string;
    type?: string | null;
}
export declare const scan: ({ label, type }: ScanParams) => Promise<string>;
interface PrintConfig {
    type?: string;
    inputType?: string | null;
}
export declare const print: (text: string, config?: PrintConfig) => Promise<void>;
export declare const clear: () => Promise<void>;
declare const terminal: {
    scan: ({ label, type }: ScanParams) => Promise<string>;
    print: (text: string, config?: PrintConfig) => Promise<void>;
    clear: () => Promise<void>;
};
export default terminal;
