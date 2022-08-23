export declare class Party1 {
    private rocksdb;
    constructor(rocksDbDir?: string);
    launchServer(): void;
    protected getRocksDb(): any;
    private initRocksDb;
}
