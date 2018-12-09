declare type Listener = (...args: any[]) => void;
export declare class EventEmitter<T extends string> {
    private readonly events;
    on(event: string, listener: Listener): () => void;
    removeListener(event: string, listener: Listener): void;
    removeAllListeners(): void;
    emit(event: string, ...args: any[]): void;
    once(event: string, listener: Listener): () => void;
}
export {};
//# sourceMappingURL=eventEmitter.d.ts.map