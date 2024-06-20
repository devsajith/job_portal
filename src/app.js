const handleErrors = require('./middleware/error-handling');
const createError = require('http-errors');
const app = require('./server')
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const { NotFound} = require('./utils/errors');
const indexRouter = require('./routes/index');
const blogRouter = require('./routes/blog');
const categoryRouter = require('./routes/category-routes');
const usersRouter = require('./routes/users-route');
const loginRouter = require('./routes/login-route');
const companyRouter = require('./routes/company-route');
const jobRouter = require('./routes/job-route');
const inquiryRouter = require('./routes/inquiry.route');
const JobApplicationRouter = require('./routes/job-application.route');
const highLevelAreaRouter = require('./routes/high-level-area-route');
const salaryRouter = require('./routes/salary-route');
const skillRouter = require('./routes/skill-route');
const careerCounselling=require('./routes/careerCounselling.routes')
const industryRouter =require('./routes/Industry-route');
const  errorMessage  = require('./utils/error-code');
const fileUploadRouter= require('./routes/file-upload.routes');
const salaryConditionRouter= require('./routes/salaryCondition.routes');
// parse application/x-www-form-urlencoded
app.use(bodyParser.json({ limit: '15mb' }));
// parse application/json
app.use(bodyParser.urlencoded({ limit: '15mb', extended: true, parameterLimit: 50000 }));

//Adding cors
app.use(cors({
  origin: process.env.ORIGIN,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

//routes
app.get("/", (req, res) => {
  res.json({ message: "welcome to jobsite" });
});
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/company', companyRouter);
app.use('/inquiry', inquiryRouter);
app.use('/blog', blogRouter);
app.use('/category', categoryRouter);
app.use('/login', loginRouter);
app.use('/job', jobRouter);
app.use('/job/apply', JobApplicationRouter);
app.use('/category/area/', highLevelAreaRouter);
app.use('/salary', salaryRouter);
app.use('/skill', skillRouter);
app.use('/careerCounselling', careerCounselling);
app.use('/industry', industryRouter);
app.use("/file", fileUploadRouter);
app.use("/salaryCondition", salaryConditionRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(new NotFound( errorMessage.API_NOT_FOUND));
});

// error handler
app.use(handleErrors);



module.exports = app;
