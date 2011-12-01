This is a really simple drop-in script that uses Richard Milewski's
anonymous [slide synchronization server][] to sync the URL hash of
any web page between a presenter and multiple viewers. It has been
tested on Firefox, Safari, Chrome, and Internet Explorer 9.

If you just want to use the script to sync remote presentations,
check out the wizard interface at http://toolness.github.com/hashsync/.

## Querystring API

By default, this script does absolutely nothing. However, if there's
a querystring parameter in the URL called `syncMode`, this script
springs into action.

If syncMode is `control`, then the user is assumed to be a presenter,
and any time they change the URL hash, its new value is broadcast
to all viewers.

If syncMode is `view`, then the user is assumed to be a viewer, and
their URL hash is updated as the presenter changes it.

Thus this script can simply be dropped-in to any existing web page
that uses a URL hash for navigation, such as Paul Rouget's [DZSlides][],
and the page immediately becomes something that can be used in a
remote presentation.

Currently, an additional querystring parameter called `syncKey`
must also be provided, which is a unique identifier for
the presenter's session. Just set it to something like
your email or twitter username and you should be fine.

Additionally, if you're the presenter and don't want others to
easily take control themselves, you can supply a `syncPass`
parameter that contains a password for your session. Once your
session is created, only a URL with the right syncPass can be
used to control it.

## Example

Here's an example of hashsync.js at work.

The presenter, Atul, has a DZSlides-based presentation at this URL:

    http://mozcamp2011.hksr.us/

He simply drops a `<script>` tag pointing at hashsync.js into the
presentation, and opens this URL in his browser:

    http://mozcamp2011.hksr.us/?syncMode=control&syncKey=atulspreso

Then he gives out this URL to a bunch of people in a conference call:

    http://mozcamp2011.hksr.us/?syncMode=view&syncKey=atulspreso

Now anytime Atul uses the left/right arrow keys to change
the current slide, everyone else on the call sees the slide change
on their browser.

  [slide synchronization server]: http://slides.netfools.com/
  [DZSlides]: http://paulrouget.com/dzslides/
