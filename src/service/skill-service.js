const Skill = require('../model/skill-model')
const SkillListView = require('../view/skill-list.view');
const logger  = require('../utils/logger-util');
const { BadRequest } = require('../utils/errors');
const { DB_ERROR } = require('../utils/error-code');
const skillType  = require('../types/skill-type');

const getSkill = async() => {

    logger.info('Fetching skills from DB')
    let skillObj = []
    try {
        //fetching skills from DB
        skillObj = await Skill.findAll({
            order: [ ['created_date','DESC'] ],
             where: {status: skillType.ACTIVE}});}
    catch{
        throw new BadRequest(DB_ERROR);
    }

    return new SkillListView(skillObj);
}

module.exports = { getSkill }