# Join Zoom
Let's make a new, user focused, way of entering a Zoom Meeting from a Cisco Room Device

## Goal
* Simplify the way users approach a Cisco Room System, when entering a Zoom Meeting
* User rich context to help Users identify with the interface and be able to find the information they need from their Invite.
* Automate where possible. Zoom has a uniform SIP pattern, let's get rid of ```@zoomcrc.com``` and do that for them :smiley:

## Why So Many Versions?

* To be honest, I had the one, and it held it's own for a while, but due to recent changes, I needed to make more
  * Not just a Join Zoom button, but the evolution of this one as well.
* Our Org buckeld down on security within Zoom, and the user experience for users entering a SIP endpoint was a bit confusing
* COVID-19 :mask: created an opportunity to develop more, so why not try to capture some statistics?
* The TRUE Predecessor to this is [Launch Meeting](https://github.com/Bobby-McGonigle/Macro-Samples/tree/master/LaunchMeeting), so there was technically there are more than 3 versions :satisfied:

## Projects

| Project | Description|
|:---|:---|
|[JoinZoom (Basic)](https://github.com/Bobby-McGonigle/Macro-Samples/tree/master/Join%20Zoom/Join%20Zoom%20(Basic))| Zoom has a uniform SIP Uri, we can exploit this to make a simple, semi-automated entry point on the Touch 10, with User Rich context|
|[Join Zoom with Security Enhancements](https://github.com/Bobby-McGonigle/Macro-Samples/tree/master/Join%20Zoom/Join%20Zoom%20with%20Security%20Enhancements)| Well my first Join Zoom button has been thworted by manditroy passwords, using the Button above muddies the water a bit, so let's refine this process so that it still provides a rich experience, but allows us to capture a meeting password and host Key too |
|[Join Zoom with Analytics](https://github.com/Bobby-McGonigle/Macro-Samples/tree/master/Join%20Zoom/Join%20Zoom%20with%20analytics)|Go Check out Microsoft Power Automate!, because we're going to use it here! I've modified the original Join Zoom button to capture key information and Post it to a spreadsheet. This spreadsheet will analyze the data and let me know if my users are using the Join Zoom button, or the Call button|

## Potential?
* Other SIP enabled calling platforms exist, and newer tools come about evry day
* This can modified for BlueJeans, Webex, Selfie.VC, etc. 
  * My hope is that Zoom opens up a more robust API for SIP systems, to allow for a better overall User experience
  * Until then, we might as well keep trying :smiley:
