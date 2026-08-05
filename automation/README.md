# Automation

Two pieces, both free. They cover the parts of enrollment that depend on timing
rather than on how many leads come in.

## 1. Auto-reply to form submissions — `autoreply.gs`

Formspree's built-in autoresponse requires the Professional plan. This is a
Google Apps Script that does the same thing for free from the
`kcbhangra@gmail.com` account.

Setup is in the header comment of `autoreply.gs`. Short version: paste it into
script.google.com signed in as kcbhangra@gmail.com, run `setup` once, then run
`dryRun` to preview before it sends anything real.

The reply copy lives in the `TEMPLATES` object at the top of the file. Each of
the four lead forms gets its own wording, matched on the hidden `subject` field
that each form now submits:

| Form | Hidden `subject` value |
|---|---|
| classes.html | `KCB LEAD: Free class inquiry` |
| seniors.html | `KCB LEAD: Seniors program` |
| workshops.html | `KCB LEAD: Workshop / booking request` |
| services.html | `KCB LEAD: Services inquiry` |

`contact.html` keeps its own user-selected subject dropdown and falls through to
the DEFAULT template.

If those hidden values are ever renamed in the HTML, rename them here too or the
script quietly falls back to the generic reply.

## 2. Trial class reminders

Not built yet. Needs a Cal.com (or Square Appointments) account, since reminders
have to be attached to a booking.

The goal is that anyone who books the free intro class automatically gets:

- a confirmation the moment they book
- a reminder 48 hours before
- a reminder the morning of

No-shows at free trials are mostly a reminder problem, not an interest problem,
so this is worth more than any follow-up sequence.

Once the booking link exists, it replaces the back-and-forth of picking a time,
and the confirmation email covers the acknowledgement that `autoreply.gs`
currently handles for that path.
