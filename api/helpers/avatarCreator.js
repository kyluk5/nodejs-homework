const AvatarGenerator = require("avatar-generator");
const path = require("path");
const avatar = new AvatarGenerator();

const variant = "male"; // By default 'male' and 'female' supported

exports.generateAvatar = async (req, res, next) => {
  const image = await avatar.generate("email@example.com", variant);
  const point = path.join(__dirname, "../../tmp/");
  image.png().toFile(`${point}${Date.now()}.png`);
  next();
};
