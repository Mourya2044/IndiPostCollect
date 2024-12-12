const jwt = require('jsonwebtoken')
const User = require('../models/User')

module.exports.userDetails = async (req, res) => {
    const token = req.cookies.jwt

    try {
        jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
            if (err) {
                console.log(err.message)
                res.status(400).json({ err })
            } else {
                // console.log(decodedToken);
                let user = await User.findById(decodedToken.id)
                // console.log(user);
                res.status(200).json({
                    email: user.email,
                    mobile: user.mobile,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    address: user.address,
                    state: user.state,
                    district: user.district,
                    city: user.city,
                    pincode: user.pincode,
                })

            }
        })
    } catch (err) {
        console.log(err);
    }

}