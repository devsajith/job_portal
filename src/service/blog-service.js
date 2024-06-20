const blog = require('../model/blog-model');
const { NotFound } = require('../utils/errors');
const listAll = async () => {
    let data = await blog.findAll({
        attributes: [['blog_id', 'blogId'], ['blog_name', 'blogName'], ['description', 'description'], ['thumbnail', 'imageUrl'], ['date_of_blog', 'dateOfBlog']],
        limit: 5,
        where: { status: 0 },
        order: [["updated_date", "DESC"]]
    });
    if (data) {
        return data;
    }
};
const listOne = async (blogId) => {
    const blogobj = await blog.findByPk(blogId,

        { attributes: [['blog_id', 'blogId'], ['blog_name', 'blogName'], ['description', 'description'], ['thumbnail', 'imageUrl'], ['date_of_blog', 'dateOfBlog'], ['URL', 'URL']] },);
    if (blogobj === null || blogobj.status == 1)
        throw new NotFound('23401-blog not found');
    else {
        return blogobj
    }
}
module.exports = { listAll, listOne };