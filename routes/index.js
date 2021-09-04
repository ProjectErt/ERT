const router = require('express').Router();

router.get("/twillio", async (req, res) => {
    console.log("works")
    res.send("Works")
})

module.exports = router;