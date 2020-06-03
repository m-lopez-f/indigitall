// server.js
import express from 'express';
import dotenv from 'dotenv';
import '@babel/polyfill';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import Routes from './src/routes'

dotenv.config();
const app = express()
const port = process.env.PORT

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(helmet());
app.disable('x-powered-by')
app.get('/', (req, res) => {
  return res.status(200).send({
    'message': `More info on /info`
  });
});

app.get('/info', (req, res) => {
  return res.status(200).send({
    'message': { 
    'All routes': [
        '/users/create #type: POST',
        '/users/:id #type: GET',
        '/users/:id/friends #type: GET',
        '/users/:id/friends/add #type: POST',
        '/users/:id/friends/total #type: GET',
        '/users/:id/delete #type: DELETE',
        '/users/:id/update #type: PUT'
      ]
    }
  });
});

Routes(app)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})