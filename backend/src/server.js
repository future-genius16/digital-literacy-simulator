require("dotenv").config()

const express = require("express")
const cors = require("cors")

const authRoutes = require("./routes/authRoutes")
const scenarioRoutes = require("./routes/scenarioRoutes")
const resultRoutes = require("./routes/resultRoutes")
const examTaskRoutes = require("./routes/examTaskRoutes")
const adminRoutes = require("./routes/adminRoutes")
const progressRoutes = require("./routes/progressRoutes")

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Digital Literacy Simulator API is running")
})

app.use(authRoutes)
app.use(scenarioRoutes)
app.use(resultRoutes)
app.use(adminRoutes)
app.use(progressRoutes)
app.use(examTaskRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})