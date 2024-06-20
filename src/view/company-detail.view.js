const JobType = require('../types/job-type');

/**
 * job view
 */
class Job {
    constructor(jobObj) {
        this.jobId = jobObj.job_id;
        this.jobTitle = jobObj.job_title;
        this.jobDescription = jobObj.description;
        this.holiday = jobObj.holiday;
        this.workingHours = jobObj.working_hours;
        this.conditions = jobObj.conditions;
        this.benefits = jobObj.benefits;
        this.comments = jobObj.comments;
        // this.prefecture = jobObj.prefecture;
        this.tags = jobObj.tags;
        this.salaryRange = jobObj.salaryRange;
    }
}

/**
 * company detail view
 */
class CompanyDetailView {
    constructor(companyObj) {
        this.companyId = companyObj.company_id;
        this.companyName = companyObj.name;
        this.description = companyObj.description;
        this.capital = companyObj.capital;
        this.location = companyObj.location;
        this.headquartersLocation = companyObj.headquarters_location;
        this.businessContent = companyObj.business_content;
        this.companyURL = companyObj.company_url;
        this.companyLogo = companyObj.company_logo;
        this.working_environment = companyObj.working_environment;
        this.industry = companyObj.industry;
        // this.prefecture = companyObj.prefecture;
        this.catchPhrase = companyObj.catch_phrase;
        this.jobs = [];
        for (let job of companyObj.jobs) {
            if (job.status === JobType.Published) {
                this.jobs.push(new Job(job));
            }
        }
        this.prefectures = [];
        for( let prefecture of companyObj.prefectures){
            this.prefectures.push( new companyPrefecture( prefecture ) )
        }
    }
}

class companyPrefecture{
    constructor(companyPrefectureDetails){
        this.prefectureId = companyPrefectureDetails.dataValues.prefectureId;
        this.prefectureName = companyPrefectureDetails.dataValues.prefectureName;
    }
  }
module.exports = CompanyDetailView;