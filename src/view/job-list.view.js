class Job {

    constructor(jobListObj, tags) {
        this.jobId = jobListObj.job_id;
        this.companyId = jobListObj.company_id;
        this.jobTitle = jobListObj.job_title;
        this.salaryId = jobListObj.salary_id;
        // this.prefectureId = jobListObj.prefecture_id;
        // this.prefectureName =  jobListObj.prefecture? jobListObj.prefecture.prefecture_name: null;
        this.description = jobListObj.description;
        this.employeeTypeTd = jobListObj.employee_type_id;
        this.holiday = jobListObj.holiday;
        this.workingHours = jobListObj.working_hours;
        this.conditions = jobListObj.conditions;
        this.benefits = jobListObj.benefits;
        this.comments = jobListObj.comments;
        this.maxSalary = jobListObj.salaryRange?jobListObj.salaryRange.max_salary: null;
        this.minSalary = jobListObj.salaryRange ? jobListObj.salaryRange.min_salary : null;
        this.companyId = jobListObj.Company.company_id;
        this.companyName = jobListObj.Company.name;
        this.catchPhrase = jobListObj.Company.dataValues.catch_phrase;
        this.industryId = jobListObj.Company.industry_id;
        this.industryName = jobListObj.Company.industry ? jobListObj.Company.industry.name : null;
        this.createdDate = jobListObj.created_date;
        this.tags =[]
        if(tags !== null){
            for(let tag of tags)
            this.tags.push( new Tag(tag));
        }

        this.prefectures = [];
        for (let prefecture of jobListObj.prefectures) {
            this.prefectures.push(new JobPrefecture(prefecture))
        }

    }

}

class Tag{
    constructor(tagObj){
        this.tagId = tagObj.tag_id;
        this.tagName = tagObj.tag_name
    }
}

class Company{
    constructor(companyObj){
        this.companyId = companyObj.company_id;
        this.companyName = companyObj.name;
        this.industryId = companyObj.industry_id;
        this.industryName = companyObj.industry.name;
    }
}

class JobListView {
    constructor(jobDbObj, fetchedJobTagDetailIdList) {
        this.jobList = []
        let i = 0;
        for (let job of jobDbObj) {
            if (job.job_id == fetchedJobTagDetailIdList[i].job_id) {
                this.jobList.push(new Job(job, fetchedJobTagDetailIdList[i].tags));
                i++;

            }
            else {
                this.jobList.push(new Job(job, null));
            }


        }
    }
}

class JobPrefecture{
    constructor(jobPrefectureDetails){
        this.prefectureId = jobPrefectureDetails.prefecture_id;
        this.prefectureName =jobPrefectureDetails.prefecture_name;
    }
}

module.exports = JobListView;