import xapi from 'xapi';

/********************************************************
 * Author: Robert McGonigle Jr, Video Services Engineer
 * robert_mcgonigle@havard.edu
 * Release: 9/21/2020
 * 
 * Last Update: 9/21/2020
 * 
 * Harvard University Information Technology
 * 
 * Description:
 *    Classroom Mode offers new functionality to Room systems, but was built out only in English
 *    This Script will detect your systems language and apply a pre-determined translation, if available, 
 *       to replace the defualt Classroom Mode text
 * 
 * Not all Languages were built out, but it's simple enough to add them in.
 * 
 * All translations were provided by Google Translate or Native Speakers.
 * 
 * Please excuse any incorrect translations, I am not a bi-lingual user, just trying to help 🙂
 *    You can customize translations or add new languages below.
********************************************************/

var systemLang = 'English';

var pollInterval;

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

determineLanguage()

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
   "FrenchCanadian": { // Native Speaker
      "Classroom": "Salle de classe",
      "Local Presenter": "Présentateur local",
      "Remote Presenter": "Présentateur distant",
      "Discussion": "Discussion"
   },
   "Spanish": { // Native Speaker
      "Classroom": "Salón de clases",
      "Local Presenter": "Presentador local",
      "Remote Presenter": "Presentador remoto",
      "Discussion": "Discusión"
   },
   "SpanishLatin": { // No Option on google, mimicked Spanish
      "Classroom": "Salón de clases",
      "Local Presenter": "Presentador local",
      "Remote Presenter": "Presentador remoto",
      "Discussion": "Discusión"
   },
   "Portuguese": { // Google Translate
      "Classroom": "Sala de aula",
      "Local Presenter": "Apresentador Local",
      "Remote Presenter": "Apresentador Remoto",
      "Discussion": "Discussão"
   },
   "PortugueseBrazilian": { // No Option on google, mimicked Portuguese
      "Classroom": "Sala de aula",
      "Local Presenter": "Apresentador Local",
      "Remote Presenter": "Apresentador Remoto",
      "Discussion": "Discussão"
   }
};

xapi.event.on('UserInterface Extensions Panel Clicked', (event) => {
   switch (event.PanelId) {
      case 'Classroom':
         break;
      default:
         break;
   }
});

function pollLanguage() {
   xapi.config.get('UserInterface Language').then((config) => {
      if (config !== systemLang) {
         systemLang = config;
         console.log('New Language found in system configuration, setting new language: ' + config)
         determineLanguage();
      } else {
         // DO NOTHING
      }
   });
}

function translasteClassroom() {
   xapi.command('UserInterface Extensions Panel Save', {
      PanelId: 'Classroom'

   },
      `
<Extensions>
  <Version>1.7</Version>
  <Panel>
    <Type>Statusbar</Type>
    <Icon>Camera</Icon>
    <Order>1</Order>
    <Name>${classRoomLang[systemLang].Classroom}</Name>
    <ActivityType>Custom</ActivityType>
    <Page>
      <Name>${classRoomLang[systemLang].Classroom}</Name>
      <Row>
        <Name/>
        <Widget>
          <WidgetId>local_presenter</WidgetId>
          <Name>${classRoomLang[systemLang]['Local Presenter']}</Name>
          <Type>Button</Type>
          <Options>size=3</Options>
        </Widget>
      </Row>
      <Row>
        <Name/>
        <Widget>
          <WidgetId>remote_presenter</WidgetId>
          <Name>${classRoomLang[systemLang]['Remote Presenter']}</Name>
          <Type>Button</Type>
          <Options>size=3</Options>
        </Widget>
      </Row>
      <Row>
        <Name/>
        <Widget>
          <WidgetId>discussion</WidgetId>
          <Name>${classRoomLang[systemLang].Discussion}</Name>
          <Type>Button</Type>
          <Options>size=3</Options>
        </Widget>
      </Row>
      <PageId>briefing_page</PageId>
      <Options>hideRowNames=1</Options>
    </Page>
  </Panel>
</Extensions>
`
   );
}
