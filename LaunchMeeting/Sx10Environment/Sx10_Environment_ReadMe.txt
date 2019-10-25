This Sx10 Environment was built on a Windows 2012 R2 Server.

Applications used
- node.js (https://nodejs.org/en/)
- npm (comes with node.js)

Modules needed
- jsxapi library (open cmd run> npm install jsxapi)
- pm2 library (open cmd run> npm install pm2)

System Requires:
- 40MB or memory per endpoint. <This may increase/decrease depeding on whether or not you edit the scripts provided.>
- Bi Directoinal communication from your server to each endpoint on port 22

Sx10 Endpoint Requirements
 - User account created with User and Integrator roles assigned (Needed to edit the {Endpoint_IP}.js file)
 - Running ce9.6.X or later
 - SSH communication enabled (on by default)
 
This is a very simple application, and I plan on coming up with some sort f UI as I conitue it, but whereas it's an Sx10
and the RK Mini is in production, I don't think it will be live in our environment long enough to require such an interface :)


You'll need to create a folder for all of you script to rest in.

Then edit the {Endpoint_IP}.js file to modify your groups domain as needed.
You will also need to enter in the credentials you made for the new User/Integrator account outlined above.

Once done, this is your new template file. Make a backup of it and stor it in another location.

The {Endpoint_IP}.js file is designed to take its own name as your endpoints IP in the script.

Duplicate this file and rename each duplicate to match the IP of each Sx10 you're trying to reach.

Once complete, go and edit your LaunchMeetingEndpointManager.config.js file.

    This file is the one you'll ultimatley launch, and it will launch all of your IP files for you when it's run.

    In order for this to take place, you'll need to add each endpoint under apps.

    We'll use the following IP's as examples in order to follow the format of this script.
      - 10.X.X.1
      - 10.X.X.2
      - 10.X.X.3
      - 10.x.x.4

The LaunchMeetingEndpointManager.config.js will look like the follwoing when first opened: 

module.exports = {
  apps : [
    {
    name: 'Sx10 Name',
    script: '{Endpoint_IP}.js',
    restart_delay: 2000 //in milliseconds
  },
    {
    name: 'Sx10 Name 2',
    script: '{Endpoint_IP_2}.js',
    restart_delay: 2000 //in milliseconds
  },
  ],
};

This format is based on pm2's ecosystem file, only renamed to suit our needs here.

Beneath apps on line 50 above, we see the start of our first endpoint added to this system
  - Its name is whatever you'd like to name it in this application. 
      i. Choose something that gives you contexts when troubleshooting
      ii. I recommend you name this after the endpoints IP, as the provided scripts will pull the endpoints name for you.
  
  - Its script is the target script you wish to run.
      i. We will be running the following example scripts. Each represent an Sx10 we'd like to talk too.
         10.x.x.1.js
         10.x.x.2.js
         10.x.x.3.js
         10.x.x.4.js
  - restart_delay: is a function of pm2. 
      i. In this example, we place a 2 second delay on the script before it starts after a crash.
      ii. The only expected crash we expect is when the endpoint loses network connectivity.
      iii. The script would crash several times during a resart, and to ease the process, we place a 2 second delay.
      
 Your new LaunchMeetingEndpointManager.config.js should reflect the following
   
 module.exports = {
  apps : [
    {
    name: '10.x.x.1',
    script: '10.x.x.1.js.js',
    restart_delay: 2000 //in milliseconds
  },
    {
    name: '10.x.x.2',
    script: '10.x.x.2.js',
    restart_delay: 2000 //in milliseconds
  },
    {
    name: '10.x.x.3',
    script: '10.x.x.3.js.js',
    restart_delay: 2000 //in milliseconds
  },
    {
    name: '10.x.x.4',
    script: '10.x.x.2.js',
    restart_delay: 2000 //in milliseconds
  },
  ],
};
  
  Notice we changed the proper information to match the IP's we intend to use, and continued along this pattern to add in 2 additional systems.
  
  Once complete, save the file and create a backup.
  
  
Now open the command terminal
  open you the directory where your LaunchMeetingEndpointManager.config.js resides
  
  Now run this command
    
    pm2 start LaunchMeetingEndpointManager.config.js
    
If all modules and software has been installed properly prior, and the endpoints are formated and set to go, you should now see a list printed of 4 endpoints connected and online in your terminal.


Once your connections have been established, load in the Sx10_LaunchMeetingUI.xml into each Sx10
  This UI may differ from the standard launch meeting UI for all other endpoints. Its set up to provide information on what to do, in the event the endpoint loses connectivity to the application. Otherwise it should behave the same as the original Launch Meeting button.
  
  
