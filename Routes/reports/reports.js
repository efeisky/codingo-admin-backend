const bodyParser = require("body-parser");
const { GetReports, GetReportById, ChangeReportStatusById } = require("../../sql/report/report_process");
module.exports = (app) => {
    app.get('/reports/profileReports',async (req,res) => {
        const {read_status} = req.query;
        const report_process = await GetReports('profile',read_status);
        if (report_process.status) {
            res.status(200).json({
                status: true,
                report_data: [...report_process.result]
            });
        } else {
            switch (report_process.errorId) {
                case 1:
                    res.status(500).json({
                        status: false,
                        error: 'DB Error | MySql is not working'
                    });
                    break;
                case 2:
                    res.status(500).json({
                        status: false,
                        error: 'Connection Error | MySql is not working'
                    });
                    break;
                default:
                    res.status(500).json({
                        status: false,
                        error: 'An unknown error occurred.'
                    });
                    break;
            }
        }
    }),
    app.get('/reports/profileDetail',async (req,res) => {
        const {reportId} = req.query;
        if (parseInt(reportId) !== 0) {
            const reportDetails = await GetReportById('profile', reportId);
            if (reportDetails.status) {
                res.status(200).json({
                    status: true,
                    report_data: {...reportDetails.result}
                });
            } else {
                switch (reportDetails.errorId) {
                    case 1:
                        res.status(500).json({
                            status: false,
                            error: 'DB Error | MySql is not working'
                        });
                        break;
                    case 2:
                        res.status(500).json({
                            status: false,
                            error: 'Connection Error | MySql is not working'
                        });
                        break;
                    case 3:
                        res.status(500).json({
                            status: false,
                            error: 'An unknown complaint number.'
                        });
                        break;
                    default:
                        res.status(500).json({
                            status: false,
                            error: 'An unknown error occurred.'
                        });
                        break;
                }
            }
            
        } else {
            res.json({
                status : false,
                error : 'Invalid report Id'
            })
        }
    }),
    app.get('/reports/contactReports',async (req,res) => {
        const {read_status} = req.query;
        const report_process = await GetReports('contact',read_status);
        if (report_process.status) {
            res.status(200).json({
                status: true,
                report_data: [...report_process.result]
            });
        } else {
            switch (report_process.errorId) {
                case 1:
                    res.status(500).json({
                        status: false,
                        error: 'DB Error | MySql is not working'
                    });
                    break;
                case 2:
                    res.status(500).json({
                        status: false,
                        error: 'Connection Error | MySql is not working'
                    });
                    break;
                default:
                    res.status(500).json({
                        status: false,
                        error: 'An unknown error occurred.'
                    });
                    break;
            }
        }
    }),
    app.get('/reports/contactDetail',async (req,res) => {
        const {reportId} = req.query;
        if (parseInt(reportId) !== 0) {
            const reportDetails = await GetReportById('contact', reportId);
            if (reportDetails.status) {
                res.status(200).json({
                    status: true,
                    report_data: {...reportDetails.result}
                });
            } else {
                switch (reportDetails.errorId) {
                    case 1:
                        res.status(500).json({
                            status: false,
                            error: 'DB Error | MySql is not working'
                        });
                        break;
                    case 2:
                        res.status(500).json({
                            status: false,
                            error: 'Connection Error | MySql is not working'
                        });
                        break;
                    case 3:
                        res.status(500).json({
                            status: false,
                            error: 'An unknown complaint number.'
                        });
                        break;
                    default:
                        res.status(500).json({
                            status: false,
                            error: 'An unknown error occurred.'
                        });
                        break;
                }
            }
        }else{
            res.json({
                status : 0,
                error : 'Invalid report Id'
            })
        }
        
    }),
    app.patch('/reports/changeStatus',bodyParser.json(),async (req,res) => {
        const {reportType, reportId, activeStatus} = req.body;
        if (reportType === 'profile' || reportType === 'contact') {
            const change_process = await ChangeReportStatusById(reportType, reportId, activeStatus == false ? 1 : 0);
            res.json({
                status : change_process.status
            })
        }else{
            res.json({
                status : false,
                error : 'Unknowed Report Type Error'
            })
        }
        
    })
}
