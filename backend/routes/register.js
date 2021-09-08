const express = require("express");
const router = express.Router();
const {
    blockAuthenticated,
    blockNotAuthenticated,
} = require("../commonFunctions");
const uuidv4 = require("uuid").v4;
const bcrypt = require("bcrypt");
const { pool } = require("../dbConfig");

//#region
/**
 * @param {string} description - Register a new user in the database
 * @param {string} [inputs] email - Email that the user optionally wants covid data sent to.
 * @param {string} [inputs] password - Password string of at least 8 characters.
 * @param {string} [inputs] password2 - Confirm password.  Must be the same as password.
 * @param {string} [inputs] acc_name - Name the user wants the system to refer to them as.  NOT used as primary or secondary key (therefore duplicates are allowed).
 * @param {string} [inputs] send_emails - Boolean.  If true server will send this user daily emails containing covid data about their selected contries.
 * @param {string} [outputs] success - Boolean, if false check error message.
 * @param {string} [outputs] msg - Message describing handling of request.
 */
//#endregion
router.post("/register", blockAuthenticated, async (req, res) => {
    let { email, password, password2, acc_name } = req.body;
    let send_emails = false;
    let acc_id = uuidv4();

    let errors = [];

    if (!email || !password || !password2 || !acc_name) {
        errors.push({
            msg: "1 or more fields left empty",
        });
    }

    if (password.length < 8) {
        errors.push({
            msg: "Password should be at least 8 characters",
        });
    }

    if (password != password2) {
        errors.push({
            msg: "Passwords do not match",
        });
    }

    if (errors.length > 0) {
        return res.send({
            success: false,
            errors: errors,
        });
    } else {
        // validation passed
        let hashedPassword = await bcrypt.hash(password, 10);
        pool.query(
            `SELECT * FROM account_tbl WHERE email = $1`,
            [email],
            (err, results) => {
                if (err) {
                    throw err;
                }

                if (results.rows.length > 0) {
                    // user already registered
                    errors.push({
                        msg: "Email already registered",
                    });
                    return res.send(400, {
                        success: false,
                        errors: errors,
                    });
                }

                pool.query(
                    `
                        INSERT INTO account_tbl(acc_id, email, password, acc_name, send_emails)
	                    VALUES ($1, $2, $3, $4, $5)
                        RETURNING acc_id, email;`,
                    [acc_id, email, hashedPassword, acc_name, send_emails],
                    (err, results) => {
                        if (err) {
                            throw err;
                        }
                        res.send({
                            success: true,
                            msg: `user created, with email ${email}`,
                        });
                    },
                );
            },
        );
    }
});

module.exports = router;
