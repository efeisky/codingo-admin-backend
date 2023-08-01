class ProfileReportModel {
    constructor(data) {
      const {
        report_id,
        complaining_user,
        complained_user,
        report_content,
        is_read,
        report_date,
      } = data;
  
      Object.defineProperty(this, "_reportId", { value: report_id, writable: false });
      Object.defineProperty(this, "_complainingUser", { value: complaining_user, writable: false });
      Object.defineProperty(this, "_complainedUser", { value: complained_user, writable: false });
      Object.defineProperty(this, "_content", { value: report_content, writable: false });
      Object.defineProperty(this, "_isRead", { value: is_read == 1, writable: false });
      Object.defineProperty(this, "_date", { value: report_date, writable: false });
    }
    get toJson() {
      return {
        reportId: this._reportId,
        complainingUser: this._complainingUser,
        complainedUser: this._complainedUser,
        content: this._content,
        readStatus: this._isRead,
        date: this._date,
      };
    }
}
class ProfileReportListModel {
  constructor(dataList) {
    this.profiles = dataList.map(item => new ProfileReportModel(item));
  }

  toJson() {
    return this.profiles.map(profile => profile.toJson);
  }
}
class ContactReportModel {
  constructor(data) {
    const {
      report_id,
      report_mail,
      report_subject,
      report_content,
      is_read,
      report_date,
    } = data;

    Object.defineProperty(this, "_reportId", { value: report_id, writable: false });
    Object.defineProperty(this, "_reportEmail", { value: report_mail, writable: false });
    Object.defineProperty(this, "_subject", { value: report_subject, writable: false });
    Object.defineProperty(this, "_content", { value: report_content, writable: false });
    Object.defineProperty(this, "_isRead", { value: is_read == 1, writable: false });
    Object.defineProperty(this, "_date", { value: report_date, writable: false });
  }

  get toJson() {
    return {
      reportId: this._reportId,
      reportEmail: this._reportEmail,
      subject: this._subject,
      content: this._content,
      readStatus: this._isRead,
      date: this._date,
    };
  }
}
class ContactReportListModel {
  constructor(dataList) {
    this.profiles = dataList.map(item => new ContactReportModel(item));
  }

  toJson() {
    return this.profiles.map(profile => profile.toJson);
  }
}
module.exports = {
  ProfileReportListModel, ContactReportListModel,
  ProfileReportModel, ContactReportModel
}