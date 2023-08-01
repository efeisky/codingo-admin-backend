class LoginModel {
    constructor(email, password, secretKey) {
      Object.defineProperty(this, "_email", { value: email, writable: false });
      Object.defineProperty(this, "_password", { value: password, writable: false });
      Object.defineProperty(this, "_secretKey", { value: secretKey, writable: false });
      Object.defineProperty(this, "_status", { value: 1, writable: true });
    }
    get email() {
      return this._email;
    }
    get password() {
      return this._password;
    }
    get customKey() {
      return this._secretKey;
    }
    get status() {
      return this._status;
    }
}

class LoginResponseModel {
  constructor(name, accessLevel, id, mail) {
    Object.defineProperty(this, "_name", { value: name, writable: false });
    Object.defineProperty(this, "_accessLevel", { value: accessLevel, writable: false });
    Object.defineProperty(this, "_id", { value: id, writable: false });
    Object.defineProperty(this, "_mail", { value: mail, writable: true });
  }
  get name() {
    return this._name;
  }
  get accessLevel() {
    return this._accessLevel;
  }
  get id() {
    return this._id;
  }
  get mail() {
    return this._mail;
  }
  get jsonFormat(){
    return {
      name : this.name,
      id : this.id,
    }
  }
}

module.exports = {
  LoginModel,
  LoginResponseModel
};