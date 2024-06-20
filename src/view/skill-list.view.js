class Skill {
    constructor(skillObj){
        this.skillId = skillObj.skill_id;
        this.skillTitle = skillObj.skill_title;
    }
}

class SkillListView {
    constructor(skillDbObj){
        this.skillList =[];
        for( let skill of skillDbObj){
            this.skillList.push( new Skill( skill ));
        }
    }
}

module.exports = SkillListView;