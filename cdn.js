const express = require('express')
const path = require('path')

const app = express()
app.use(express.static(path.resolve(__dirname, './cdn')))

app.listen(80, () => console.log('CDN running'))
