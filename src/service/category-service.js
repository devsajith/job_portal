const pickupCategory = require('../model/pickupCategory-model');
const category = require('../model/category-model');
const subCategory = require('../model/subCategory-model');
const { BadRequest, NotFound, InternalServerError } = require('../utils/errors');
const logger  = require('../utils/logger-util');
const CategoryListView = require("../view/category-list.view")
const categoryType = require('../types/category-type')


const listAll = async () => {
    let data = await pickupCategory.findAll({
        attributes: [['pickup_category_id', 'pickupCategoryId']],
        include: [{
            model: subCategory ,as:"subCategory",
            where: { status: 1 },
            attributes: [['job_sub_category_id', 'categoryId'], ['name', 'name']],
        }],
        order: [["created_date", "DESC"]],
    },
    );
    
    if (data) {
        return data;
    }
};


const listCategory = async() => {

    let categoryList  = [];
    try{
        categoryList = await category.findAll({ 

            order: [ ['updated_date','DESC'] , [subCategory ,'updated_date','DESC' ] ],
            where:{
                status:categoryType.ACTIVE
            },
            include: [{
                model: subCategory
                // order: [ [ {model:subCategory },'updated_date','DESC'] ],
            }
            ]
        });
    }
    catch(error){
        logger.warn("DB error category fetch");
        throw new InternalServerError('DB error');
    }   

    logger.info("Creating category list view");

    return new CategoryListView(categoryList);

    // return categoryList;
}

module.exports = { listAll, listCategory };