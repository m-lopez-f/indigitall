import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import db from '../db';
import Utils from '../utils';

const User = {
  /**
   * Create A User
   * @param {object} req 
   * @param {object} res
   * @returns {object} reflection object 
   */
  async create(req, res) {

    const hashPassword = Utils.hashPassword(req.body.password);
    const createQuery = `INSERT INTO
      users(id, email, username, password, latitude, longitude, language, created_date, modified_date)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8)
      returning *`;
    const values = [
      uuidv4(),
      req.body.email,
      req.body.username,
      hashPassword,
      req.body.latitude,
      req.body.longitude,
      req.body.language,
      moment(new Date()),
      moment(new Date())
    ];

    try {
      const { rows } = await db.query(createQuery, values);
      const token = Utils.generateToken(rows[0].id);
      return res.status(201).send({ user: rows[0], token });
    } catch(error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(400).send({ 'message': 'User with that EMAIL already exist' })
      }
      return res.status(400).send(error);
    }
  },
  async update(req, res) {
    const findOneQuery = 'SELECT * FROM users WHERE id=$1';
    const updateOneQuery =`UPDATE users
      SET email=$1,username=$2,password=$3,modified_date=$4
      WHERE id=$5 returning *`;
    try {
      const { rows } = await db.query(findOneQuery, [req.params.id]);
      if(!rows[0]) {
        return res.status(404).send({'message': 'user not found'});
      }
      const hashPassword = Utils.hashPassword(req.body.password);
      const values = [
        req.body.email || rows[0].email,
        req.body.username || rows[0].username,
        hashPassword || rows[0].password,
        moment(new Date()),
        req.params.id,
      ];
      const response = await db.query(updateOneQuery, values);
      return res.status(200).send(response.rows[0]);
    } catch(err) {
      return res.status(400).send(err);
    }
  },
  /**
   * Delete A User
   * @param {object} req 
   * @param {object} res 
   * @returns {void} return status code 204 
   */
  async delete(req, res) {
    const deleteQuery = 'DELETE FROM users WHERE id=$1 returning *';
    try {
      const { rows } = await db.query(deleteQuery, [req.user.id]);
      if(!rows[0]) {
        return res.status(404).send({'message': 'user not found'});
      }
      return res.status(204).send({ 'message': 'deleted' });
    } catch(error) {
      return res.status(400).send(error);
    }
  },
  async getAll(req, res) {
    const findAllQuery = 'SELECT * FROM users';
    try {
      const { rows, rowCount } = await db.query(findAllQuery, [req.user.id]);
      return res.status(200).send({ rows, rowCount });
    } catch(error) {
      return res.status(400).send(error);
    }
  },
  /**
   * Get A Reflection
   * @param {object} req 
   * @param {object} res
   * @returns {object} reflection object
   */
  async getOne(req, res) {
    const text = 'SELECT * FROM users WHERE id = $1';
    try {
      const { rows } = await db.query(text, [req.params.id]);
      if (!rows[0]) {
        return res.status(404).send({'message': 'user not found'});
      }
      return res.status(200).send(rows[0]);
    } catch(error) {
      return res.status(400).send(error)
    }
  },
  async getFriends(req, res) {
    const text = 'SELECT * FROM users WHERE id = $1';
    const textFriends = 'SELECT u.* FROM users u rigth join friends_user fu where u.id = fu.user_friend and fu.user_id = $1';
    try {
      const { rows } = await db.query(text, [req.params.id]);
      if (!rows[0]) {
        return res.status(404).send({'message': 'user not found'});
      }
      const { rowsFriends } = await db.query(textFriends, [req.params.id]);
      return res.status(200).send({ friends: rowsFriends[0] });
    } catch(error) {
      return res.status(400).send(error)
    }
  },
  async getTotalFriends(req, res) {
    const text = 'SELECT * FROM users WHERE id = $1';
    const textFriends = 'SELECT count(fu.*) as totalFriends FROM users u rigth join friends_user fu where u.id = u.user_id and fu.user_id = $1';
    try {
      const { rows } = await db.query(text, [req.params.id]);
      if (!rows[0]) {
        return res.status(404).send({'message': 'user not found'});
      }
      const { rowsFriends } = await db.query(textFriends, [req.params.id]);
      return res.status(200).send({ friends: rowsFriends[0] });
    } catch(error) {
      return res.status(400).send(error)
    }
  },
  async addFriend(req, res) {
    const text = 'SELECT * FROM users WHERE id = $1';
    try {
      const { rows } = await db.query(text, [req.params.id]);
      if (!rows[0]) {
        return res.status(404).send({'message': 'user not found'});
      }

      const { rowsFriends } = await db.query(text, [req.body.friendId]);
      if (!rowsFriends[0]) {
        return res.status(404).send({'message': 'friend\'s user not found'});
      }
      const createQuery = `INSERT INTO
      friends_user(id, user_id, user_friend)
      VALUES($1, $2, $3)
      returning *`;
      const values = [
        uuidv4(),
        req.params.id,
        req.body.friendId,
      ];

      try {
        const { rows } = await db.query(createQuery, values);
        return res.status(201).send({ user: rows[0] });
      } catch(error) {
        return res.status(400).send(error);
      }
    } catch(error) {
      return res.status(400).send(error)
    }
  }
}

export default User;
