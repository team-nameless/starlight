export class EventEmitter {
  static on(event: string, callback: Function): void;
  static off(event: string, callback: Function): void;
  static removeListener(event: string): void;
  static emit(event: string, ...args: any[]): void;
}
