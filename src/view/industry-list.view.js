class Industry {
    constructor(industryDbObj){
        this.industryId = industryDbObj.industry_id;
        this.industryTitle = industryDbObj.name;
    }
}

class IndustryListView {
    constructor(industryDbObj){
        this.industryList =[] 
        for(let industry of industryDbObj){
            this.industryList.push(new Industry(industry));
        }
    }
}

module.exports= IndustryListView;