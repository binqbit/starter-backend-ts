import { Collection, Document } from "mongodb";
import uuid from "node-uuid";
import database, { USER_COLLECTION, ValueCollection } from "../database";

export class User {
    public id: string;
    public login: string;
    public password: string;

    constructor(login: string, password: string) {
        this.id = uuid.v4();
        this.login = login;
        this.password = password;
    }

    public checkPassword(password: string): boolean {
        return this.password === password;
    }
}

export class UserCollection extends ValueCollection {
    constructor(collection: Collection<Document>) {
        super(collection);
    }

    public async findUserById(id: string): Promise<User | null> {
        return await super._findValue<User>({ id });
    }

    public async findUserByLogig(login: string): Promise<User | null> {
        return await super._findValue<User>({ login });
    }

    public async insertUser(user: User): Promise<void> {
        await super._insertValue(user);
    }

    public async updateUser(user: User): Promise<void> {
        await super._updateValue({ id: user.id }, { ...user });
    }

    public async deleteUser(user: User): Promise<void> {
        await super._deleteValue({ id: user.id });
    }
}

export function userCollection() {
    return new UserCollection(database.getCollection(USER_COLLECTION));
}