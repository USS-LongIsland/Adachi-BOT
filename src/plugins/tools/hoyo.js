function hoyo(msg) {
  const message = 'HelloWorld';
  msg.bot.say(msg.sid, message, msg.type, msg.uid);
 }
export { hoyo };
