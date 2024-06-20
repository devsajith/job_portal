const axios = require('axios');
const AWS = require('aws-sdk');
const fs = require('fs');
const FormData = require('form-data');
const dotenv = require('dotenv');
const { Op } = require('sequelize');
const { setTimeout } = require('timers/promises');
const token = require('../model/bullhornToken-model');
const logger = require('../utils/logger-util');
const User = require('../model/user-model');
const userService = require('./../service/user-service');
const jobService = require('./../service/job-service')
const CareerCounselling = require('../model/careerCounselling-model');
const CareerCounsellingApplication = require('../model/careerCounsellingApplication-model');
const JobApplication = require('../model/job-application.model');
/**
 * Method to create a new candidate in the bullhorn
 * @param {*} email 
 * @returns 
 */
const createCandidate = async (email) => {
    // Try and execute the code using a User search by email
    try {
        let user = await User.findByPk(email, {
            attributes: [
                'user_id',
                'first_name',
                'middle_name',
                'last_name',
                'email',
                'date_of_birth',
                'bullhorn_id',
                'prefecture',
                'tel_number',
                'desired_occupation',
                'resume',
                'city',
                'apartment_name',
                'status'
            ]
        });
        // Check if bullhorn is enabled
        if (process.env.ENABLE_BULLHORN) {
            let address = {};
            address.city = user.apartment_name ? user.city + user.apartment_name : user.city;
            address.state = user.prefecture;
            // Create data object to contain user info for bullhorn candidate registration
            let data = {
                firstName: user.first_name,
                middleName: user.middle_name,
                lastName: user.last_name,
                email: user.email,
                mobile: user.tel_number,
                address: address,
                occupation: user.desired_occupation,
                dateOfBirth: (new Date(user.date_of_birth)).getTime()
            }
            // Generate access token
            const token = await generateAccessToken();
            // Put data into Bullhorn using axios and the access token
            const bullhorn_id = await axios.put(process.env.BHREST_URL + 'entity/Candidate?BhRestToken=' + token, data)
                .then(function (response) {
                    logger.info("get bullhorn token");
                    // Check if a resume exists
                    if (user.resume) {
                        let s3 = new AWS.S3();
                        // Get object resume folder from s3
                        const OLD_KEY = 'temporary/' + user.resume;
                        const objectParams = {
                            Bucket: process.env.BUCKET,
                            Key: OLD_KEY
                        };
                        // Download the resume file from S3
                        const file = s3.getObject(objectParams).promise().then(function (res) {
                            logger.info("fetch file from S3");
                            // Create a FormData object and append the resume file
                            const form = new FormData();
                            form.append('file', res.Body, { filename: OLD_KEY });
                            logger.info("form appended to form data");
                            // Construct the URL and access token, place file in Candidate section of Bullhorn with specific externalID
                            const url = process.env.BHREST_URL + 'file/Candidate/' + response.data.changedEntityId + '/raw?filetype=SAMPLE&externalID=portfolio&BhRestToken=' + token;
                            axios.put(url, form, {
                                headers: form.getHeaders()
                            })
                            console.log("bullhorn response");
                        });
                        console.log("file appended to form data", file);
                    }
                    return response.data.changedEntityId
                })
                .catch(function (error) {
                    console.error("Error with createCandidate function", error);
                    console.error("Error with createCandidate function");
                })
            console.log("bullhorn_id", bullhorn_id);
            logger.info('user with name' + user.first_name + 'added to bullhorn');
            // Update the user with Bullhorn ID
            let updateData = await User.findByPk(email, { attributes: ['user_id', 'status'], });
            updateData.bullhorn_id = bullhorn_id;
            updateData.bullhorn_updated_date = new Date();
            await updateData.save();
        }
        return user;
    }
    catch (err) {
        console.log(err)
    }
}
const applyJob = async (userId, jobId) => {
    try {
        logger.info("Creating job application in bullhorn");
        const user = await userService.listUserDetailsWithbullhorn(userId)
        const job = await jobService.listjobdetailsWithbullhorn(jobId)
        if (user.dataValues.bullhorn_id && job.dataValues.bullhorn_id) {
            let data = {
                "candidate": { "id": user.dataValues.bullhorn_id },
                "jobOrder": { "id": job.dataValues.bullhorn_id },
                "status": "New Lead",
                "dateWebResponse": Math.floor(Date.now() / 1000)
            }
            logger.info("Generating bhrestoken before creating job application in bullhorn");
            let access_token = await generateAccessToken()
            if (access_token) {
                const bullhorn_id = await axios.put(process.env.BHREST_URL + 'entity/JobSubmission?BhRestToken=' + access_token, data)
                    .then(function (response) {
                        console.log(response.data)
                        return response.data.changedEntityId
                    })
                    .catch(function (error) {
                        logger.error(`job apply bullhorn update ${error}`)
                        console.log(error)
                    })
                logger.info(`Created job application in bullhorn ${bullhorn_id}`);
                console.log("bullhorn_id", bullhorn_id);
                logger.info('Job applied for user with user_id ' + user.user_id + ' job_id ');
                // Update the job application with Bullhorn ID
                const jobApplication = await JobApplication.findOne({
                    where: {
                        user_id: userId,
                        job_id: jobId
                    }
                });
                if (jobApplication) {
                    // Update the job application record
                    jobApplication.bullhorn_id = bullhorn_id;
                    jobApplication.bullhorn_updated_date = new Date();
                    await jobApplication.save();
                    logger.info(`Updated job application with bullhorn id in DB`)
                } else {
                    // The job application record was not found
                    console.error(`Job application with userId ${userId} and jobId ${jobId} not found.`);
                }
                return bullhorn_id;
            }
        }
    }
    catch (err) {
        console.log(err)
    }
}

const applyCareerCounselling = async (careerCounsellingApplication) => {
    try {

        const user = await User.findByPk(careerCounsellingApplication.user_id);
        const careerCounselling = await CareerCounselling.findByPk(careerCounsellingApplication.career_counselling_id)
        logger.info(`Fetching career counsell job bullhorn id from DB`)
        if (process.env.ENABLE_BULLHORN && user.bullhorn_id && careerCounselling.job_bullhorn_id) {
            let data = {
                "candidate": { "id": user.bullhorn_id },
                "jobOrder": { "id": careerCounselling.job_bullhorn_id },
                "status": "New Lead",
                "dateWebResponse": Math.floor(Date.now() / 1000)
            }
            logger.info(`Fetching bullhorn access token`)
            let access_token = await generateAccessToken()

            if (access_token) {
                logger.info(`creation application in bullhorn`)
                const bullhorn_id = await axios.put(process.env.BHREST_URL + 'entity/JobSubmission?BhRestToken=' + access_token, data)
                    .then(function (response) {
                        console.log(response.data)
                        return response.data.changedEntityId
                    })
                    .catch(function (error) {
                        logger.error(`carreer counsil apply bullhorn update ${error}`)
                        console.log(error)
                    });
                logger.info(`created application in bullhorn ${bullhorn_id}`)
                const careerCounsellingApplicationDBObj = await CareerCounsellingApplication.findByPk(careerCounsellingApplication.career_counselling_application_id);
                careerCounsellingApplicationDBObj.bullhorn_id = bullhorn_id;
                await careerCounsellingApplicationDBObj.save();
                logger.info(`Updated career counsell  application bullhorn id in DB`)
                return bullhorn_id;
            }
        }
    }
    catch (err) {
        console.log(err)
    }
}

//Method to generate a generate access token.
const generateAccessToken = async () => {
    if (process.env.ENABLE_BULLHORN) {
        logger.info("Starting proccess to create bhrestoken");
        try {

            logger.info("Fectch bullhorn token flag from DB");
            let tokenFlag = await token.findByPk(3)
            if (tokenFlag.token == "1") {
                logger.info("process is put to sleep");
                await setTimeout(5000);
                tokenFlag = await token.findByPk(3)
                logger.info(`Fectched bullhorn token flag from DB ${tokenFlag.token}`);

            }
            if (tokenFlag.token == "0") {

                logger.info(`Fectching current bullhorn refreshtoken  from DB`);
                let refreshtoken = await token.findByPk(1)
                console.log('Current bullhorn refresh_token  from DB -', refreshtoken);
                logger.info(`Fectching current bullhorn bHResttoken  from DB`);
                let bHResttoken = await token.findByPk(2)
                console.log('Current bullhorn BHRest token  from DB', bHResttoken);
                const nodeTime = Date.now();
                const mysqlTime = new Date(refreshtoken.updated_date).getTime();
                console.log(nodeTime, mysqlTime)
                if ((mysqlTime + 300000) < nodeTime) {
                    tokenFlag.token = "1"
                    await tokenFlag.save()
                    logger.info(`Bullhorn token flag set  to ${tokenFlag.token} in DB`);
                    let refresh_token = refreshtoken.token
                    logger.info(`Fetching new  access token from bullhorn`);
                    let access_token;
                    access_token = await axios.post('https://auth.bullhornstaffing.com/oauth/token?grant_type=refresh_token&refresh_token='
                        + refresh_token + '&client_id=' + process.env.BULLHORN_CLIENT_ID + '&client_secret=' + process.env.BULLHORN_SECRET)
                        .then(function (response) {
                            refreshtoken.token = response.data.refresh_token
                            refreshtoken.save();
                            return response.data.access_token
                        })
                        .catch(async function (error) {
                            logger.info(`inside catch block`);
                            logger.error(`Error occurred while fetching refresh token ${error}`);
                            console.log(error);
                            const errorResponse = error.response.data.error;
                            logger.info(`Error Response invalid_grant`);
                            logger.info(`Error Response - ${errorResponse}`);
                            //If the error response is invalid_grant, then generate new code
                            if (errorResponse === 'invalid_grant') {
                                logger.info(`inside invalid grant block`);
                                const newTokenObj = await generateCode();
                                logger.info(`Error Response invalid_grant`);
                                console.log('Generated token object from generateNewAccessToken() newTokenObj : ', newTokenObj);
                                access_token = newTokenObj.access_token;
                                console.log('access_token in generated in catch section', access_token);
                                logger.info(`new access_token in generated in catch section`);
                                logger.info('old refreshtoken', refreshtoken.token);
                                refreshtoken.token = newTokenObj.refresh_token;
                                logger.info('new refreshtoken', refreshtoken.token);
                                await refreshtoken.save();
                                return access_token;
                            }
                            tokenFlag.token = "0"
                            tokenFlag.save();
                        })
                    if (access_token) {
                        console.log('access_token to create bullhornRestdata ', access_token);
                        logger.info(`access_token to create bullhornRestdata: ${access_token}`);
                        let bullhornRestdata = await axios.post(' https://rest.bullhornstaffing.com/rest-services/login?version=*&access_token=' + access_token)
                            .then(function (data) {

                                return data.data.BhRestToken

                            }).catch(function (error) {
                                logger.error(`Error occurred while fetching bhrestoken token ${error}`);
                                console.log(error);
                                tokenFlag.token = "0"
                                tokenFlag.save();
                            })
                        logger.info('refreshtoken',access_token);
                        console.log('refreshtoken', access_token);
                        refreshtoken.token = access_token;
                        await refreshtoken.save();
                        console.log('bullhornRestdata', bullhornRestdata);
                        logger.info('bullhornRestdata', bullhornRestdata);
                        bHResttoken.token = bullhornRestdata
                        await bHResttoken.save()
                        tokenFlag.token = "0"
                        logger.info('token flag', tokenFlag);
                        await tokenFlag.save()
                        return bullhornRestdata
                    }
                    else {
                        logger.error(`Access token not found`);

                        tokenFlag.token = "0"
                        tokenFlag.save();
                        return null;
                    }

                }
                else {
                    return bHResttoken.token
                }

            }


        }
        catch (err) {
        }
    }

}

//Method to generate new code to create 'Access token'
const generateCode = async () => {
    const {
        BULLHORN_CLIENT_ID,
        BULLHORN_AUTHORIZE_URL,
        BULLHORN_USER_NAME,
        BULLHORN_PASSWORD } = process.env;

    const params = new URLSearchParams({
        client_id: BULLHORN_CLIENT_ID,
        response_type: 'code',
        action: 'Login',
        username: BULLHORN_USER_NAME,
        password: BULLHORN_PASSWORD
    });

    try {
        const response = await axios.get(BULLHORN_AUTHORIZE_URL + params);
        const url = response.request.socket._httpMessage.path;
        const code = (url.split('?')[1].split('&')[0]);
        const returnCode = code.includes('code') ? code.split('=')[1] : null;

        if (returnCode) {
            logger.info(`New access token : ${returnCode}`);
            const tokenData = await generateNewAccessToken(returnCode, BULLHORN_CLIENT_ID);
            console.log('Access token and refresh token created using new code : ', tokenData);
            return tokenData;
        } else {
            throw new Error('Unable to generate access token');
        }
    } catch (error) {
        logger.error(`New access token generation failed: ${error.message}`);
        throw error;
    }
}

//Method to generate new access token from code
const generateNewAccessToken = async (code, client) => {
    const {
        BULLHORN_SECRET,
        BULLHORN_GENERATE_TOKEN_URL } = process.env;

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('client_id', client);
    params.append('client_secret', BULLHORN_SECRET);

    try {
        logger.info(`Generating new access token from :  ${code}`);
        const response = await axios.post(BULLHORN_GENERATE_TOKEN_URL + 'grant_type=authorization_code&code=' + code + '&client_id=' + client + '&client_secret=' + BULLHORN_SECRET);
        return response.data;
    } catch (error) {
        logger.info(`Generating new access token failed: ${error.response}`);
        return null;
    }
}

module.exports = { generateAccessToken, createCandidate, applyJob, applyCareerCounselling, generateCode, generateNewAccessToken };