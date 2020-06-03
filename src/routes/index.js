import users from './users';

const Routes = app => {
  app.use('/users', users)
}

export default Routes;