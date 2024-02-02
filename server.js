import app from './app/app.js'
import http from 'http';

//port
const PORT = 3000

//create server
const server  = http.createServer(app)
server.listen(PORT, console.log(`Server is running on PORT ${PORT}`))

