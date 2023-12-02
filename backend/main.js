const express = require('express')

const app = express()

app.get('/', (req, res) => {
    res.send('Hello from Express!')
})

app.post('/connect', (req, res) => {
    res.send('Connected to the backend!')
})

app.listen(8000, () => console.log('Server ready'))
