
const subCategoryType = require('../types/subCategory-type')

class CategoryListView{

    constructor(categoryDbObj){
        this.categoryList =[]
        for( let category of categoryDbObj){
            this.categoryList.push(new Category(category));
        }

    }

}


class Category {
 
    constructor(categoryObj){
        this.id = categoryObj.category_id;
        this.categoryTitle = categoryObj.name
        this.subCategoryList = [];
        for(let subCategory of categoryObj.job_sub_categories){
            if(subCategory.status == subCategoryType.ACTIVE)
                this.subCategoryList.push( new SubCategory(subCategory));

        }
    }
}



class SubCategory{
    constructor(subCategoryObj){
        this.subId = subCategoryObj.job_sub_category_id
        this.subCategoryTitle = subCategoryObj.name
    }
}



module.exports = CategoryListView
