const randomNumber = (length = 8) => {
  const chars = "0123456789".split("");
  var str = "";
  for (let i = 0; i < length; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
};

export default randomNumber;
