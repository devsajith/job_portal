class userDetailView {

    constructor(userObj){
        this.userId = userObj.user_id;
        this.firstName = userObj.first_name;
        this.middle_name = userObj.middle_name;
        this.lastName = userObj.last_name;
        this.phoneNumber = userObj.tel_number;
        this.resume = userObj.resume;
        this.prefecture = userObj.prefecture;
        this.email = userObj.email;
        this.city = userObj.city;
        this.apartmentName  = userObj.apartment_name;
        this.experience = userObj.experience;
        this.desiredOccupation = userObj.desired_occupation;
        this.status = userObj.status;
        this.dateOfBirth = userObj.date_of_birth;
        this.createdDate = userObj.created_date;
        this.updatedDate = userObj.updated_date;
    }
}

module.exports = userDetailView;