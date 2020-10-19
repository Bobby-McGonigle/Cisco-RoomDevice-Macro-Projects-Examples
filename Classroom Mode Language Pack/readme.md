# Classroom Mode Language Pack

## Inspiration

CANADA! :maple_leaf:

Well at least a French speaking colleague of mine in Canada :smiley:.

For those familiar with classroom mode on a Room Kit plus, Sx80, or Room Kit Pro Room device by Cisco, it's clear that this is running off of a back-end macro script we don't have access too normally.

To my surprise, I learn from a good bi-lingual friend of mine that the Classroom Mode script, as of 10-19-2020 (Could change in the future), only generate the Classroom mode UI in English.

I would have never known as I only speak English, but that could be up for debate as well :wink:

I decided to help out my friend, and as many others as I could with Google translate and volunteers to help expand the language portfolio of the Classroom Mode UI.

Luckily for us, even though the script is hidden, the UI Extensions are exposed, so we can target them with new text :smirk:

## Goal

* Translate the classroom mode language for non-English speakers
* Automate this by referencing the language set on the Cisco Room Device

## Built out Languages

|Language|Description|
|:---|:---|
|English|*Standard Language packaged in Classroom Mode*|
|EnglishUK|*Mimics Standard Language*|
|French|*Translated to French using Google Translate*|
|FrenchCanadian|*Translated to FrenchCanadian with help from a native speaker*|
|Spanish|*Translated to Spanish with help from a native speaker*|
|SpanishLatin|*Mimicked Spanish using Google Translate, no option for SpanishLatin on Google Translate*|
|Portuguese|*Translated to Portuguese using Google Translate*|
|PortugueseBrazilian|*Mimicked Portuguese using Google Translate, no option for PortugueseBrazilian on Google Translate*|

## What You'll need

* Cisco Room Device on ce9.8.X or greater (Works on Cloud registered endpoints too)
  * Endpoint must support Classroom mode
* Admin Access
* Some Knowledge on the Macro Editor
* Some Knowledge on Editing Scripts

* An open mind and some mercy :sweat_smile:
  * I don't speak multiple languages, I did what I could with volunteers and Google translate
  * As far as I know, what I've crafted so far should be accurate
  * Only trying to help :sweat_smile:

## How does the script work

The script will reference the Language set on the Cisco Room Device
* If a language profile of the same type exists in the script, it will push the new language to the Widget Values of the Classroom UI

* This script will poll the language field every 5 seconds, so if you we're to change languages with another script or remotely, the UI will update within 5 seconds if that language is available

* If the language profile has not been added, then it will default the the standard English text

## How to add another Language Profile

Add your new Language to the ```determineLanguage``` function on line 29

```javascript
function determineLanguage() {
   xapi.config.get('UserInterface Language').then((config) => {
      switch (config) {
         case 'English':
         case 'EnglishUK':
         case 'French':
         case 'FrenchCanadian':
         case 'Portuguese':
         case 'PortugueseBrazilian':
         case 'Spanish':
         case 'SpanishLatin':
            clearInterval(pollInterval);
            console.log('Language Detected: ' + config + '. Updating Classroom Mode text to ' + config);
            systemLang = config;
            translasteClassroom();
            break;
         default:
            clearInterval(pollInterval);
            console.warn('Language Detected: ' + config + '. No translation available in this script. Please modify "var classRoomLang" to include this language.');
            console.log('Defaulting to "English"')
            systemLang = 'English';
            translasteClassroom();
      }
      clearInterval(pollInterval);
      pollInterval = setInterval(pollLanguage, 5000);
      //return myTimer
   });
}
```

Then add your translation to the ```classRoomLang``` variable on line 60

```javascript
var classRoomLang = {
   "English": { // Native Text from Classroom Mode, can be modified for better User Context
      "Classroom": "Classroom",
      "Local Presenter": "Local Presenter",
      "Remote Presenter": "Remote Presenter",
      "Discussion": "Discussion"
   },
   "EnglishUK": { // Native Text from Classroom Mode, can be modified for better User Context
      "Classroom": "Classroom",
      "Local Presenter": "Local Presenter",
      "Remote Presenter": "Remote Presenter",
      "Discussion": "Discussion"
   },
   "French": { // Google Translate
      "Classroom": "salle de cours",
      "Local Presenter": "Présentateur local",
      "Remote Presenter": "Présentateur distant",
      "Discussion": "Discussion"
   },
   {/* More Languages */}
```

Be sure to follow the same format and test

Supported system languages can be found under the configuration item ```xConfiguration UserInterface Language```

Be sure to match the case of these languages

## Getting Started

* Go to [crm_Language_Pack.js](https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/blob/master/Classroom%20Mode%20Language%20Pack/crm_Language_Pack.js), copy the contents of this script
* Paste this script in as a new Macro on a Room Device that has Classroom mode enabled
* Save the script, and toggle the script on

The script should be up and running!

## Things to consider
* Not all languages have been added
  * Not hard to add your own to the script
  * Hopefully Cisco will address this native Tool properly in the future

* Try connecting this to the Google Translate APIs and automate the process
  * Better yet, can you make a universal translator for All Macro scripts using Google :wink:

## Author(s)

* **Robert McGonigle Jr**

## Acknowledgments

* Cisco Room Device Team
* Special Thanks to Zacharie Gignac for inspiration and testing
* My End Users
* Antoine Eduoard - *Mentor*
* Dawn Passerini - *Mentor*
