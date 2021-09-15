const router = require('express').Router();
const Employee = require('../model/Employee')
const EmergencyEvent = require('../model/EmergencyEvent');

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
    const password = req.body.password
    const employee = await Employee.findOne({ "email": email })

    if(!employee)
        return res.send({ employee_logged_in: false, message: "Check you entered email" })
    
    if(employee.phone_number.toString() !== password.toString())
        return res.send({ employee_logged_in: false, message: "Check you entered password" })
        
    return res.send({ employee_logged_in: true, message: "Logged in successfully", employee_id: employee.employee_id  })
 })

 router.get("/emergency_alert/start", async (req, res) => {
    const emergencyEvent = new EmergencyEvent({
        emergency_event_id: Date.now(),
        emergency_status: "is_happening",
        safe_employees: []
    })

    const emergencyAlertAdded = await emergencyEvent.save()

    const accountSid = 'ACf06d6f13746a745b3bd6fa88ab9a26c4';
    const authToken = '15fd62f4c0c07f61e56e1ccf7e21c45e';
    const client = require('twilio')(accountSid, authToken);
    const employees= await Employee.find({})
    employees.forEach (employee=>{
        client.calls
        .create({
           url: 'http://demo.twilio.com/docs/voice.xml',
           to: '+91'+ employee.phone_number,
           from: '+18508188361'
         })
        

        client.messages
        .create({
            body: 'Emergency Alert!!! Visit to MarkYourSelfSafe : http://localhost:3000/emp',
            to: '+91'+ employee.phone_number,
            from: '+18508188361'
        })
    })

    return res.status(200).send({ status:"success", message: "Successfully added emergency event" })
 })

 router.get("/emergency_alert/check_status", async(req, res) => {
    const emergencyEventisRunning = await EmergencyEvent.findOne({ "emergency_status": "is_happening" })

    if(!emergencyEventisRunning)
        return res.send({"emergency_status": "ended"})
    
    return res.send({ "emergency_status": emergencyEventisRunning.emergency_status })
 })

 router.get("/emergency_alert/end", async(req, res) => {
    const emergencyEnded = await EmergencyEvent.findOneAndUpdate({ "emergency_status": "is_happening"}, {"emergency_status": "ended"})
     
    if(!emergencyEnded)
        return res.status(500).send({"emergency_status":"no_emergency", "message": "No Emergency happening"})
    else
        return res.status(200).send({ "emergency_status":"ended", "message": "Successfully ended emergency event" })
 })

 router.get("/emergency_alert/safe_emp", async(req, res) => {
    const safeEmployees = await EmergencyEvent.findOne({"emergency_status": "is_happening"}).select("safe_employees")
    if(safeEmployees){
        safeEmployees.emergency_status = "is_happening"
        return res.send(safeEmployees)
    }
    return res.send({ "emergency_status":"no_emergency", "message": "No emergency event happening" })
})

router.post("/employee/marked_as_safe", async(req, res) => {
    const emergencyEvent = await EmergencyEvent.find({emergency_status:"is_happening"}).select("safe_employees")
    const safeEmployees = emergencyEvent[0].safe_employees

    const {email, phone_number} = req.body
    const markedEmployee = {email, phone_number: phone_number}
    safeEmployees.push(markedEmployee)

    await EmergencyEvent.findOneAndUpdate({ "emergency_status": "is_happening"}, {safe_employees: safeEmployees})

    res.send({'message': 'You have been marked as safe', 'status':'marked_safe'})
})

module.exports = router;