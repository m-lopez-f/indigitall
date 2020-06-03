import moment from 'moment';
import {v4} from 'uuid';
import db from '../db';
import Utils from '../utils';
import UserModel from '../models/user'

const User = {
  /**
   * Create A User
   * @param {object} req 
   * @param {object} res
   * @returns {object} reflection object 
   */
  async create(req, res) {
    console.log(`
    /**
     * Create A User
     * @param {object} req 
     * @param {object} res
     * @returns {object} reflection object 
     */
    `)
    console.log(req.body)
    if (!req.body.email || !req.body.password || !req.body.username) {
      return res.status(400).send({'message': 'Some values are missing'});
    }
    if (!Utils.isValidEmail(req.body.email)) {
      return res.status(400).send({ 'message': 'Please enter a valid email address' });
    }
    const hashPassword = Utils.hashPassword(req.body.password);
    const email = req.body.email
    const username = req.body.username
    const latitude = req.body.latitude
    const longitude = req.body.longitude
    const language = req.body.language
    const isSouthOrNorth = await Utils.isSouthOrNorth(latitude, longitude)
    const userData = {
      email,
      username,
      latitude,
      longitude,
      language,
      password: hashPassword
    }
    if (isSouthOrNorth === 'N') {
      return await UserModel.create(req, res)
    } else if (isSouthOrNorth === 'S') {
      return await Utils.processSouthern(userData)
    }
  },
  /**
   * Update A User
   * @param {object} req 
   * @param {object} res
   * @returns {object} user object 
   */
  async update(req, res) {
    console.log(`
      /**
     * Update A User
     * @param {object} req 
     * @param {object} res
     * @returns {object} user object 
     */
    `)
    return await User.update(req, res)
  },
  /**
   * Delete A User
   * @param {object} req 
   * @param {object} res 
   * @returns {void} return status code 204 
   */
  async delete(req, res) {
    console.log(`
    /**
     * Delete A User
     * @param {object} req 
     * @param {object} res 
     * @returns {void} return status code 204 
     */
    `)
    return await UserModel.update(req, res)
  },
  /**
   * Get All user
   * @param {object} req 
   * @param {object} res
   * @returns {object} user object
   */
  async getAll(req, res) {
    console.log(`
    /**
     * Get All user
     * @param {object} req 
     * @param {object} res
     * @returns {object} user object
     */
    `)
    return await UserModel.getAll(req, res)
  },
  /**
   * Get A user
   * @param {object} req 
   * @param {object} res
   * @returns {object} user object
   */
  async getOne(req, res) {
    console.log(`
    /**
     * Get A user
     * @param {object} req 
     * @param {object} res
     * @returns {object} user object
     */
    `)
    return await UserModel.getOne(req, res)
  },
  /**
   * Get user friends
   * @param {object} req 
   * @param {object} res
   * @returns {object} user friends object
   */
  async getFriends(req, res) {
    console.log(`
    /**
     * Get user friends
     * @param {object} req 
     * @param {object} res
     * @returns {object} user friends object
     */
    `)
    return await UserModel.getFriends(req, res)
  },
  /**
   * Add user friends
   * @param {object} req 
   * @param {object} res
   * @returns {object} user friend object
   */
  async addFriend(req, res) {
    console.log(`
    /**
     * Add user friend
     * @param {object} req 
     * @param {object} res
     * @returns {object} user friend object
     */
    `)
    return await UserModel.addFriend(req, res)
  },
  async getTotalFriends(req, res) {
    console.log(`
    /**
     * Get user total friends
     * @param {object} req 
     * @param {object} res
     * @returns {object} user totalFriends
     */
    `)
    return await UserModel.getTotalFriends(req, res)
  }
}

export default User;
