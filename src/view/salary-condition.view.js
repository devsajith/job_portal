class SalaryCondition {
    constructor(salaryConditionDbObj){
        this.salaryId = salaryConditionDbObj.salary_condition_id;
        this.salary = salaryConditionDbObj.salary;
        this.salaryString = salaryConditionDbObj.salary_string;
    }
}

class SalaryConditionListView {
    constructor(salaryConditionDbObj){
        this.salaryConditionList =[] 
        for(let salaryCondition of salaryConditionDbObj){
            this.salaryConditionList.push(new SalaryCondition(salaryCondition));
        }
    }
}

module.exports= SalaryConditionListView;