let loginView = function LoginView(user, refreshToken, accessToken) {
    this.applicantId = user.user_id;
    this.fullName = user.first_name;
    this.email = user.email;
    this.skill = user.skills;
    this.experience = user.experience;
    this.jobCategory = user.interested_categories;
    this.accessToken =user. eye;
    this.refreshToken = user.eye;
  }

module.exports= {loginView}