import fs from 'fs';
import path from 'path';

export default class History {
  directory;

  constructor(directory) {
    this.directory = directory;
    fs.mkdirSync(this.directory, {recursive: true});
  }

  getLastIP(name, hostedZoneId) {
    return this._readFile(this.getPath(name, hostedZoneId));
  }

  setLastIP(name, hostedZoneId, ip) {
    fs.writeFileSync(this.getPath(name, hostedZoneId), ip);
  }

  getPath(name, hostedZoneId) {
    return path.join(this.directory, `${hostedZoneId}_${name}`);
  }

  _readFile(path) {
    try {
      return fs.readFileSync(path).toString();
    } catch (e) {
      return null;
    }
  } 
}