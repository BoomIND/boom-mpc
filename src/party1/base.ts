import { bindings } from "../bindings";
import util from "util";
import path from "path";

const data: { [index: string]: string } = {};
class RocksDB {
  dbDir: string;
  constructor(dbDir: string) {
    this.dbDir = dbDir;
  }

  async open(options: object) {}

  async get(key: string, options: object) {
    return data[key];
  }
}

export class Party1 {
  private rocksdb: any; // 2P-Sign messages DB

  public constructor(rocksDbDir?: string) {
    if (rocksDbDir) {
      this.initRocksDb(rocksDbDir);
      console.log("inited");
    }
  }

  public launchServer() {
    console.log("calling bindings.p1_launch_server();");
    bindings.p1_launch_server();
  }

  protected getRocksDb() {
    return this.rocksdb;
  }

  private initRocksDb(rocksDbDir: string) {
    this.rocksdb = new RocksDB(rocksDbDir);
    // this.rocksdb.open = util.promisify(this.rocksdb.open);
    // this.rocksdb.get = util.promisify(this.rocksdb.get);
  }
}
