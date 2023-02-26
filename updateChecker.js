//update checker version 1.0, for discord webhooks

var request = require('request');
var discord = require('discord.js');
var configuration = {target: "https://venge.io/changes.txt", webhook: false, roleID: 0}
try {
  configuration = require('./config.js'); //config file must export the target url, the webhook url, and the roleID
} catch (e) {}

var webhook = configuration.webhook && new discord.WebhookClient({url: configuration.webhook});
var lastValue = null;
var difference = null;

function get() {
  request(configuration.target, function (error, response, body) {
    error && console.log(error);
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
  setTimeout(main, 1800000);
}
main();