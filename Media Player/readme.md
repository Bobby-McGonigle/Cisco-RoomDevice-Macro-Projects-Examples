# Media Player

This script is intended for Webex Room and Board series endpoints on ce9.9.X and up. Is also compatible on cloud registered endpoints

## Getting Started

Download a copy for the script available here call mediaPlayer.js
Edit the ```mediaList``` variable to include all of the content you'd like to deliver to your users.

### How the script works

* The Script will evaluate the abject array in the Media List
```javascript
{
  "Title": "Google 1", //This tile will show next to the video
  "Duration": "10", // This is how long your content will run
  "URL": "https://www.google.com/", //This is the source of your content
  "WidgetId": "media_1", //This is the widget ID of the button that will be built
  "Category": "Google" //This is the category this content belongs too. This will create a new page if it had not already existed
          }
```
* Based on the object array and it's content, the script will build the XML needed for each row and page.
  * Each Page will be based off the category provided
  * Each row will populate in their respective page, providing a button and information for the user
* After the mediaList object array has been sorted through, a new Panel will be pushed onto the Touch 10, similar to the one below.
![exampleUI.png](https://github.com/Bobby-McGonigle/Macro-Samples/blob/master/Media%20Player/exampleUI.PNG)
* From there, the UI elements should start working based on the information you have provided in the script

### Example format

```javascript
var mediaList = [
    {
        "Title": "Google 1",
        "Duration": "10",
        "URL": "https://www.google.com/",
        "WidgetId": "media_1",
        "Category": "Google"
                },
    {
        "Title": "Yahoo 1",
        "Duration": "10",
        "URL": "https://www.yahoo.com/",
        "WidgetId": "media_2",
        "Category": "Yahoo"
              },

```

### Prerequisites

* Cisco Webex Room Series Endpoint
* Software Version: ce9.9.X or greater
* Admin Access to system
* Knowledge on how to navigate to the Macro Editor, or loading in scripts
* Your network is open to the target media your trying to reach

### Installing

* Download the script
* Edit the mediaList variable to suit your communication needs
* load your edited script into the endpoint
* turn on the macro 
* test

## Running the tests

* Check to see if the content is playing as you expected.

* For example, if you need to play a Youtube video, be sure no ads on on this particular video, as it could disrupt the playback
* Using the embedded link will allow for the video to be full screen
* set the embed link to auto-play as well.

## Deployment

There are many flavors of deployment, but I recommend using Ce-Deploy by Christopher Norman, as it's a great tool for loading this into a whole environment quickly and easily.

* [CE-Deploy](https://github.com/voipnorm/CE-Deploy)

## Things to Consider
* This script was built on the need for my own deployment purposes
* Some edits may be required, as this may tamper with some configuration you already have set on your devices
* For example, this script assumes you do not use Digital Signage normally.
  * If you do, please make edits to limit the impact
* Test Test Test :)

## Author(s)

* **Robert McGonigle Jr**

## Acknowledgments

* Cisco Room Device Team
* My End Users
* Antoine Eduoard - *Mentor*
* Broderic Flannery - *Assisted in testing*
* Dawn Passerini - *Mentor*
