const router = require('express').Router();

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

module.exports = router;