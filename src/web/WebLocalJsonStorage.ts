import {JsonStorage} from "ferrum-plumbing/dist/serviceTypes/Storage";

function jsonOrNull(v?: string) {
  if (!v) { return v; }
  if (!v.startsWith('{') && !v.startsWith('[')) {
    return v;
  }
  return JSON.parse(v);
}

export class WebLocalJsonStorage implements JsonStorage {
  async load(key: string): Promise<any> {
    // @ts-ignore
    return jsonOrNull(localStorage.getItem(key));
  }

  async remove(key: string): Promise<void> {
    // @ts-ignore
    return localStorage.removeItem(key);
  }

  async save(key: string, val: any): Promise<void> {
    // @ts-ignore
    localStorage.setItem(key, JSON.stringify(val));
  }
}