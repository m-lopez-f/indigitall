import express from 'express';
import Auth from '../middleware/Auth';
import User from '../controllers/user';

const router = express.Router();
router.use(function timeLog(req, res, next) {
    next();
});
router.post('/create', User.create);
router.get('/:id', User.getOne);
router.get('/:id/friends', User.getFriends);
router.post('/:id/friends/add', User.addFriend);
router.get('/:id/friends/total', User.getTotalFriends)
router.delete('/:id/delete', User.delete);
router.put('/:id/update', User.update);

module.exports = router;