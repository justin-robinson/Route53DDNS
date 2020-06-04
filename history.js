import fs from 'fs';
import path from 'path';

export default class History {
  directory;

  constructor(directory) {
    this.directory = directory;
    fs.mkdirSync(this.directory, {recursive: true});
  }

  getLastRecordValue(hostedZoneId, name, type) {
    return this._readFile(this.getPath(name, type, hostedZoneId));
  }

  setLastRecordValue(hostedZoneId, name, type, value) {
    fs.writeFileSync(this.getPath(name, type, hostedZoneId), value);
  }

  getPath(hostedZoneId, name, type) {
    return path.join(this.directory, [hostedZoneId, name, type].join('_'));
  }

  _readFile(path) {
    try {
      return fs.readFileSync(path).toString();
    } catch (e) {
      return null;
    }
  } 
}