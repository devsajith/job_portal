const prefectureType = require('../types/prefecture-type');


class Area {
    constructor(areaObj){
        this.id = areaObj.high_level_location_id;
        this.areaTitle = areaObj.high_level_location_name;
        let prefectureList = []
        for(let prefecture of areaObj.prefectures){
            if(prefecture.status == prefectureType.ACTIVE)
                prefectureList.push(new Prefecture(prefecture))
        }

        this.prefectures = prefectureList;
    }
}

class Prefecture{
    constructor(prefecture){

    this.prefectureId = prefecture.prefecture_id;
    this.prefectureTitle = prefecture.prefecture_name;

    }
}

class AreaListView{
    constructor(areaListObj){
        let areas = [];
        for(let area of areaListObj){
            areas.push( new Area(area ))
        }
        this.areaList = areas;
        
    }
}

module.exports = AreaListView ;