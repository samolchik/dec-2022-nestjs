import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private users = [
    // { id: '1', name: 'Olga', age: 23 },
    // { id: '2', name: 'Egor', age: 3 },
  ];
  constructor() {}

  async getAllUsers() {
    return this.users;
  }

  async getUserById(userId: string) {
    return this.users.find((item) => item.id === userId);
  }

  async createUser(data) {
    const userId = new Date().getMilliseconds();
    const { name, age } = data;
    const newUser = { id: userId, name, age };
    this.users.push(newUser);
    return newUser;
  }

  async updateUserById(userId: string, data) {
    const user = this.users.findIndex((item) => item.id === userId);
    if (user === -1) {
      return null;
    }
    this.users[user] = [...this.users[user], ...data];
    return this.users[user];
  }

  async deleteUserById(userId: string) {
    this.users.filter((item) => item.id === userId);
  }
}
