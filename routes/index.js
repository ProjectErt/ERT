const router = require('express').Router();
const Employee = require('../model/Employee')
const EmergencyEvent = require('../model/EmergencyEvent')

router.get("/twillio", async (req, res) => {
    console.log("works")
    res.send("Works")
})


router.post("/login", async (req, res) => {
    if(req.body.password !== "admin"){

        return res.send({logged_in: false})
    }
    return res.send({logged_in: true})
})

router.post("/emp/login", async (req, res) => {
    const email = req.body.email
    const phoneNumber = req.body.phone_number
    const employee = await Employee.findOne({ "email": email })

    if(!employee)
        return res.send({ employee_logged_in: false, message: "Check you entered email" })
    
    if(employee.phone_number !== phoneNumber)
        return res.send({ employee_logged_in: false, message: "Check you entered password" })
        
    return res.send({ employee_logged_in: true, message: "Logged in successfully" })

 })

module.exports = router;