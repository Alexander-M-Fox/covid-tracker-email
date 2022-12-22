const express = require('express');
const router = express.Router();
const { blockAuthenticated } = require('../commonFunctions');
const { pool } = require('../dbConfig');
const passport = require('passport');

router.post(
    '/login',
    blockAuthenticated,
    passport.authenticate('local'),
    async (req, res) => {
        pool.query(
            `SELECT email
        FROM account_tbl
        WHERE email=$1;`,
            [req.body.email],
            (err, results) => {
                if (err) {
                    throw err;
                }
                if (results.rows.length == 0) {
                    return res.send({
                        success: false,
                        msg: 'login worked, but cant find userID for that email',
                    });
                }
                res.send({
                    success: true,
                    msg: 'logged in',
                    email: results.rows[0]['email'],
                });
            }
        );
    }
);

module.exports = router;
