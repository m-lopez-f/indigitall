import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const Utils = {
  /**
   * Hash Password Method
   * @param {string} password
   * @returns {string} returns hashed password
   */
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
  },
  /**
   * comparePassword
   * @param {string} hashPassword 
   * @param {string} password 
   * @returns {Boolean} return True or False
   */
  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  },
  /**
   * isValidEmail Utils method
   * @param {string} email
   * @returns {Boolean} True or False
   */
  isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  },
  /**
   * Generate Token
   * @param {string} id
   * @returns {string} token
   */
  generateToken(id) {
    const token = jwt.sign({
      userId: id
    },
      process.env.SECRET, { expiresIn: '7d' }
    );
    return token;
  },
  processSouthern(data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  },
  isSouthOrNorth(latitude, longitude) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
      if (latitude >= 0 && latitude <= 90
        && longitude >= -180 && longitude <= 180) {
          resolve('N');
      } else if (latitude < 0 && latitude >= -90
        && longitude >= -180 && longitude <= 180) {
          resolve('S');
      } else {
        reject(new Error('Bad values'));
      }
      }, 700);
    });
  }
}

export default Utils;