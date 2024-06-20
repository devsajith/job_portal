
const getNextPage = (page, limit, total) => {
    if ((total / limit) > page) {
        return page + 1;
    }

    return null
}

const getPreviousPage = (page) => {
    if (page <= 1) {
        return null
    }
    return page - 1;
}

const paginate = (data, pageNo, pageSize, count, hascreatedDate) => {
    if(hascreatedDate){
        let hasNextpage = false;
        if(data.jobList && (data.jobList.length > pageSize)){
            hasNextpage = true;
                      
        }
        
        return {
            nextPage: hasNextpage,
            total: count,
            limit: pageSize,
            data: data.jobList
        }
    }

   return {
            previousPage: getPreviousPage(pageNo),
            currentPage: pageNo,
            nextPage: getNextPage(pageNo, pageSize, count),
            total: count,
            totalPages: Math.ceil(count/pageSize),
            limit: pageSize,
            data: data
        }

} 



module.exports= { paginate }