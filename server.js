const express = require("express")
const app = express()
const utilities = require("./utilities/")
const baseController = require("./controllers/baseController")

app.get("/", (req, res, next) => {
  console.log("Handling / route")
  baseController.buildHome(req, res, next).catch(next)
})

app.use((err, req, res, next) => {
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  res.status(500).send("Server Error: " + err.message)
})

const port = process.env.PORT || 10000
const host = "0.0.0.0"

app.listen(port, host, () => {
  console.log(`app listening on ${host}:${port}`)
})