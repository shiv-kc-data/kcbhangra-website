/**
 * KC Bhangra — Formspree auto-reply
 *
 * Formspree's own autoresponse is a paid feature. This does the same job for
 * free from the kcbhangra@gmail.com account.
 *
 * How it works: Formspree emails a notification for each submission and sets
 * Reply-To to the person who filled in the form. This script picks up those
 * notifications, sends the person an acknowledgement, and labels the thread so
 * it never replies twice.
 *
 * SETUP
 *  1. script.google.com, signed in as kcbhangra@gmail.com. New project.
 *  2. Paste this file in, save.
 *  3. Run `setup` once and grant the permissions it asks for.
 *  4. Run `dryRun` to preview what it would send without sending anything.
 *  5. Once the preview looks right, `setup` has already installed a trigger
 *     that runs every 5 minutes. Nothing else to do.
 *
 * To change wording, edit TEMPLATES below. To pause it, delete the trigger
 * under the clock icon in the Apps Script sidebar.
 */

var PROCESSED_LABEL = 'kcb/autoreplied';
var FROM_NAME = 'KC Bhangra';
var LOOKBACK = 'newer_than:2d';

/** Reply copy per form. Keyed by the hidden `subject` field on each form. */
var TEMPLATES = {
  'KCB LEAD: Free class inquiry': {
    subject: 'Got your message about classes',
    body:
      'Thanks for reaching out about classes. Your message came through and ' +
      'Shiv will get back to you personally within 24 hours.\n\n' +
      'In the meantime: the free intro class is September 6. No experience ' +
      'needed, nothing to bring, just show up. If you already know you want a ' +
      'spot, reply to this email and we will hold one for you.\n'
  },
  'KCB LEAD: Seniors program': {
    subject: 'Got your message about the seniors program',
    body:
      'Thanks for asking about the seniors program. Your message came through ' +
      'and Shiv will follow up personally within 24 hours.\n\n' +
      'The sessions are built around low impact movement and going at your own ' +
      'pace. Anyone can join regardless of background or fitness level. If you ' +
      'have questions before then, just reply here.\n'
  },
  'KCB LEAD: Workshop / booking request': {
    subject: 'Got your workshop request',
    body:
      'Thanks for the workshop enquiry. Your request came through and Shiv will ' +
      'be in touch within 24 hours to talk through dates, group size, and what ' +
      'you have in mind.\n\n' +
      'If your event has a fixed date, reply with it and we will check ' +
      'availability first thing.\n'
  },
  'KCB LEAD: Services inquiry': {
    subject: 'Got your message',
    body:
      'Thanks for getting in touch. Your message came through and Shiv will ' +
      'reply personally within 24 hours with details and next steps.\n'
  },
  'DEFAULT': {
    subject: 'Got your message',
    body:
      'Thanks for reaching out to KC Bhangra. Your message came through and ' +
      'Shiv will get back to you within 24 hours.\n'
  }
};

var SIGNATURE = '\nShiv\nKC Bhangra\nkcbhangra.com\n';

/** One-time setup: create the label and install the recurring trigger. */
function setup() {
  if (!GmailApp.getUserLabelByName(PROCESSED_LABEL)) {
    GmailApp.createLabel(PROCESSED_LABEL);
  }
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'processNewSubmissions') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('processNewSubmissions').timeBased().everyMinutes(5).create();
  Logger.log('Label and 5-minute trigger installed.');
}

/** Preview mode. Logs what would be sent, sends nothing, labels nothing. */
function dryRun() {
  run_(true);
}

/** The trigger target. */
function processNewSubmissions() {
  run_(false);
}

function run_(preview) {
  var label = GmailApp.getUserLabelByName(PROCESSED_LABEL);
  if (!label) {
    Logger.log('Label missing. Run setup() first.');
    return;
  }

  var query = 'from:formspree.io -label:' + PROCESSED_LABEL + ' ' + LOOKBACK;
  var threads = GmailApp.search(query, 0, 50);
  Logger.log(threads.length + ' unprocessed submission(s).');

  threads.forEach(function (thread) {
    var msg = thread.getMessages()[0];
    var to = extractSubmitterEmail_(msg);

    if (!to) {
      Logger.log('SKIP (no submitter address): ' + thread.getFirstMessageSubject());
      return;
    }

    var tpl = TEMPLATES[matchTemplateKey_(msg)] || TEMPLATES.DEFAULT;
    var name = extractFirstName_(msg.getPlainBody());
    var greeting = name ? 'Hi ' + name + ',\n\n' : 'Hi,\n\n';
    var body = greeting + tpl.body + SIGNATURE;

    if (preview) {
      Logger.log('--- would send ---\nTo: ' + to + '\nSubject: ' + tpl.subject + '\n\n' + body);
      return;
    }

    GmailApp.sendEmail(to, tpl.subject, body, { name: FROM_NAME });
    thread.addLabel(label);
    Logger.log('Replied to ' + to);
  });
}

/** Formspree sets Reply-To to the submitter; fall back to parsing the body. */
function extractSubmitterEmail_(msg) {
  var replyTo = msg.getReplyTo();
  if (replyTo && replyTo.indexOf('formspree') === -1) {
    var m = replyTo.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
    if (m) return m[0];
  }
  var line = msg.getPlainBody().match(/^\s*email\s*[:\-]\s*([\w.+-]+@[\w-]+\.[\w.-]+)/im);
  return line ? line[1] : null;
}

/** Match on our hidden `subject` field, which differs per form. */
function matchTemplateKey_(msg) {
  var haystack = msg.getSubject() + '\n' + msg.getPlainBody();
  for (var key in TEMPLATES) {
    if (key !== 'DEFAULT' && haystack.indexOf(key) !== -1) return key;
  }
  return 'DEFAULT';
}

/** Handles first_name, firstName, or a combined name field. */
function extractFirstName_(body) {
  var patterns = [
    /^\s*first[_ ]?name\s*[:\-]\s*(.+)$/im,
    /^\s*name\s*[:\-]\s*(.+)$/im
  ];
  for (var i = 0; i < patterns.length; i++) {
    var m = body.match(patterns[i]);
    if (m) {
      var first = m[1].trim().split(/\s+/)[0];
      if (first && first.length < 30) {
        return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
      }
    }
  }
  return null;
}
