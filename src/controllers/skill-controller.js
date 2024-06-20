
const skillService = require('../service/skill-service')
const getSkill = (req, res, next) => {
    skillService.getSkill()
    .then( (resp) => {
        return res.send(resp);
    })
    .catch( (err) => {
       return next(err); 
    })
}

module.exports = { getSkill}