import fs from 'fs';
import path from 'path';
import config from '../../../config/config.js';

class FileSystemManager {
  constructor(basePath) {
    this.basePath = basePath;
  }

  _getPath(filePath) {
    return path.join(this.basePath, filePath);
  }

  async readFile(filePath) {
    try {
      const data = await fs.promises.readFile(this._getPath(filePath), 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('File read error:', err);
      return null;
    }
  }

  async writeFile(filePath, data) {
    try {
      await fs.promises.writeFile(
        this._getPath(filePath),
        JSON.stringify(data, null, 2),
        'utf-8'
      );
    } catch (err) {
      console.error('File write error:', err);
    }
  }

  async deleteFile(filePath) {
    try {
      await fs.promises.unlink(this._getPath(filePath));
    } catch (err) {
      console.error('File delete error:', err);
    }
  }
}

const path = config.filesystem_path;
export default new FileSystemManager(path);
