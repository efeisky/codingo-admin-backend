class AccessModel {
    constructor(name, accessLevel) {
      Object.defineProperty(this, "_name", { value: name, writable: false });
      Object.defineProperty(this, "_accessLevel", { value: accessLevel, writable: false });
    }
    get name() {
      return this._name;
    }
    get accessLevel() {
      return this._accessLevel;
    }
    get json() {
      return {
        admin_name : this.name,
        admin_level : this.accessLevel
      };
    }
  }

module.exports = {
    AccessModel
}