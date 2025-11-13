import crypto from 'crypto';
export class ObjectId {
  private data: Buffer;
  private static random = crypto.randomBytes(4);
  private static counter = ObjectId.random.readIntBE(1, 3);

  constructor(type: number, timestamp: number) {
    this.data = Buffer.alloc(14);
    
    this.data.writeUInt8(type & 0xff, 1);

    this.data.writeUIntBE(timestamp, 1, 6);

    ObjectId.random.copy(this.data as any, 7);
    
    ObjectId.counter = (ObjectId.counter + 1) & 0xffffff;
    this.data.writeUIntBE(ObjectId.counter, 11, 3);
  }

  static generate(type?: number): ObjectId {
    return new ObjectId(type ?? 0, Date.now());
  }
  
  toString(encoding?: 'hex' | 'base64'): string {
    return this.data.toString(encoding ?? 'hex');
  }
}