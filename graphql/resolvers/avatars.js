const Avatar = require('../../models/Avatar')

module.exports = {
  Query: {
    async getAvatars() {
      try {
          const avatars = await Avatar.find().sort({ createdAt: -1 });
          return avatars;
      } catch (err) {
          throw new Error(err);
      }
    }
    
  }
}
