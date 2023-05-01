//update checker version 1.2, for discord webhooks

var request = require('request');
var discord = require('discord.js');
var configuration = {target: "https://venge.io/changes.txt", webhook: false, roleID: 0, delay: 1800000}
try {
  configuration = require('./config.js'); //config file must export the target url, the webhook url, the roleID, and optionally the header (a constant string that is stripped away from the top of the file), or time in ms between every check (delay)
} catch (e) {}

var webhook = configuration.webhook && new discord.WebhookClient({url: configuration.webhook});
var lastValue = null;
var difference = null;

function get() {
  request(configuration.target, function (error, response, body) {
    if(error) {
      console.log(error);
      return;
    }
    if(configuration.header) {
      body = body.split(configuration.header)[1];
    }
    difference = body.split(lastValue)[0];
    lastValue != null && difference && fireWebhook("<@&"+configuration.roleID+"> Game has been updated!\n```"+difference+"```");
    lastValue = body;
  });
}
function fireWebhook(data) {
  configuration.webhook && webhook.send({content: data}) || console.log(data);
}
function main() {
  get();
  setTimeout(main, configuration.delay || 1800000);
}
main();
