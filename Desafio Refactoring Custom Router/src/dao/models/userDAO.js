import MongoManager from '../managers/mongoManager.js';
import FileSystemManager from '../managers/fileSystemManager.js';
import userSchema from '../../models/user.model.js'; // Importar el esquema
import { v4 as uuidv4 } from 'uuid';

class UserDAO {
  constructor(dataSource) {
    if (dataSource === 'mongo') {
      this.model = MongoManager.connection.model('users', userSchema); // Usar el esquema
    } else if (dataSource === 'fileSystem') {
      this.fileSystem = FileSystemManager;
      this.filePath = 'users.json';
    }
  }

  async createUser(userData) {
    if (this.model) {
      const user = new this.model(userData);
      return await user.save();
    } else if (this.fileSystem) {
      const users = (await this.fileSystem.readFile(this.filePath)) || [];
      const newUser = { id: uuidv4(), ...userData };
      users.push(newUser);
      await this.fileSystem.writeFile(this.filePath, users);
      return newUser;
    }
  }

  async getUserById(userId) {
    if (this.model) {
      return await this.model.findById(userId).populate('cart');
    } else if (this.fileSystem) {
      const users = (await this.fileSystem.readFile(this.filePath)) || [];
      return users.find((user) => user.id === userId);
    }
  }

  async getUserByEmail(email) {
    if (this.model) {
      return await this.model.findOne({ email }).populate('cart');
    } else if (this.fileSystem) {
      const users = (await this.fileSystem.readFile(this.filePath)) || [];
      return users.find((user) => user.email === email);
    }
  }
}

export default UserDAO;
