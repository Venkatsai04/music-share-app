module.exports = {
  // Generate a random 5-character string
  // consisting of lowercase letters and numbers
  generate: () => {
    let idStr = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i += 1) {
      idStr += characters.charAt(Math.floor(Math.random()
                * characters.length));
    }
    return idStr;
  },
};
