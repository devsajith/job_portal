class Salary {
    constructor(salaryDbObj){
        this.salaryId = salaryDbObj.salary_range_id;
        this.salaryFrom = salaryDbObj.min_salary;
        this.salaryTo = salaryDbObj.max_salary;
    }
}

class SalaryListView {
    constructor(salaryDbObj){
        this.salaryList =[] 
        for(let salary of salaryDbObj){
            this.salaryList.push(new Salary(salary));
        }
    }
}

module.exports= SalaryListView;