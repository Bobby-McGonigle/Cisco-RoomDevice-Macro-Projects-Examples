# Memory Functions!

## Disclaimer

This Script was oringinally written by a colleague of mine, and I had beta tested it. 

Through our tests, we found ways to optimize this script to be the best it can be in this Macro environement.

Defininitley a Co-Authored Script, details below :smiley:

## Inspiration

The need for a better and more robust version of the initial Macro Memory script

The original was limited, required a bit of set-up and wasted a facility service slot

With the enhancements of the Macro Editor in ce9.14 and Higher, we can make a more refined version eliminating those constraints.

## What You'll Need
* A compatible Endpoint
  * Sx20, Sx80, Mx Series, Dx Series
  * Room Series, Board Series, Desk Series or greater
* Admin Access to the Room Device
* Room Device on CE9.14.X or greater, or Stable Cloud Channel
* Some Knowledge on the Macro Editor
* Some Knowledge on Javascript
* Some Knowledges on Importing/Exporting Modules

## How does the script work

When "**Memory_Functions**" is activated on your endpoint, it will generate a new Macro called "**Memory_Storage**" by default.
  * This will not re-generate a new one if one already exists on your endpoint :smiley:

This new macro will work alongside the Memory_Functions Macro as your main storage repository

You won't see this at first, so please **refresh your page** :smiley:

In addition to generating the storage repo for your endpoint, it will also search your endpoint for any script that do no have the Memroy Functoins imported and will edit each macro to provide an import.

This search relies on your endpoint having the following string availble

```javascript
import xapi from 'xapi';
```

Once you see the import messages stop in the console, once again, **refresh the page** :smiley:

This is the default string found in all newer scripts by default. If your script does not have this string, then the automatic import will fail.
Directions for a manual import will be shown later on in this document.

Once all of that has processed (it's rather quick) you should be ready to make use of all of the functions available

## Functions!!!

For the purposes of these function descriptions we will be referencing the below **Memory_Storage** example

```javascript
var memory = {
    "key": "value",
    "myGlobalVar": "[a-zA-Z]",
    "myMacro": {
        "myLocalVar": "$2,000"
    },
    "otherMacro": {
        "icecream": "['chocolate', 'strawberry', 'vanilla']",
        "pizza": "['pepperoni', 'cheese', 'bacon']"
    }
}
```

### Exported Functions
All functions under ```var mem``` are exported. These are: 

* mem.write(key, value)
* mem.write.global(key, value)
* mem.read(key)
* mem.read.global(key)
* mem.remove(key)
* mem.remove.global(key)
* mem.print()
* mem.print.global()

### mem.write(key, value)

**mem.write(_key_, _value_)** is a Promise and expects an object key and a value to assign that object. 

This is also a function that effects the script your currently working in. That way you can work in each script independantly, without having to worry if you're mixing information with another macro. All non **.global()** functions only effect the script you're working in.

Let's create a new macro called "myTestMacro"

In this macro, let's write a new piece of information.

```javascript
import xapi from 'xapi';

import { mem } from './Memory_Functions';

mem.write('myInfo', 'ABC123')
```
Save this script, once it runs, refresh your browser and you will see this new piece of information written to our **Memory_Storage** Macro as

```javascript
var memory = {
    "key": "value",
    "myGlobalVar": "[a-zA-Z]",
    "myMacro": {
        "myLocalVar": "$2,000"
    },
    "otherMacro": {
        "icecream": "['chocolate', 'strawberry', 'vanilla']",
        "pizza": "['pepperoni', 'cheese', 'bacon']"
    },
    "myTestMacro": {
        "myInfo": "ABC123" //<<<-- new Information Here!
    }
}
```
Notice how, in our example above, we did not have a object called "myTestMacro". What mem.write() will do, is add in the name will create an object named after the macro you're working in and created a nested object of the information you want to write :smiley:

This is how we're able to avoid other scripts from accessing information they don't necessarily need

#### What if I want to right more that just 1 piece of information?
* You can, but you need to be mindful that this process needs to resolve a promise first before it rights, so syntax is Key for a successful write

### Writing style A (prefered)
Build a nested object locally in your macro then write this object when it's finished being built

For example

```javascript
import xapi from 'xapi';

import { mem } from './Memory_Functions';

var myNestedObject = {
    "newObject" : "Hello from New Object"
}

myNestedObject["anotherObject"] = { 
                                    "Test_A": "3.127",
                                    "Test_B": "8.625"
                                   }
console.log(myNestedObject)
/*
Printed in Console
{
  "newObject" : "Hello from New Object",
  "anotherObject" : { 
                     "Test_A": "3.127",
                     "Test_B": "8.625"
                    }
*/

mem.write('myNestedObject', myNestedObject)
```

Style A will allow you to quickly build your information and sotre it all at once

### Writing style B

If you need to write multiple nest objects, then either make build a larger nested object with all the information or chain your mem.write functions

For example
```javascript
import xapi from 'xapi';

import { mem } from './Memory_Functions';

var myNestedObject = {
    "newObject" : "Hello from New Object",
    "secondObject" : "Hello from Second Object"
}

var myOtherObject = {
    "Test_A" : "3.127",
    "Test_B": "8.625",
    "Results" : {
                  "A*B" : "26.970375",
                  "A+B" : "11.752"
               }
}


mem.write('myNestedObject', myNestedObject).then(()=>{
  mem.write('myOtherObject', myOtherObject).the(()=>{
    //Keep Chaining as need or run other code when complete
  })
})
```
Though Style A is preferred, Style be may be a neccessary alternative to right, depending on your use case.

### Before we move on
Most other functions we'll cover makes us of the same principles detailed in mem.write() for that, I won't be going as in depth in the remaing examples, to allow this document some breathing room :smiley:

### mem.write._global_('key', 'value)

**mem.write._global_(_key_, _value_)** is a Promise and expects an object key and a value to assign that object. 

The main difference between mem.write() and mem.write.**global** is that this will allow you to save information at the top level of the Memory_Storage macro and can not be read by any non-global functions
(well, unless you have a macro as the same name as an object you're trying to create :sweat_smile:)

To identify what is global vs local
```javascript
var memory = {
    "key": "value", //<<<---Global
    "myGlobalVar": "[a-zA-Z]", //<<<---Global
    "myMacro": { //<<<---Global
        "myLocalVar": "$2,000"  //<<<---Local
    },
    "otherMacro": {  //<<<---Global
        "icecream": "['chocolate', 'strawberry', 'vanilla']",//<<<---Local
        "pizza": "['pepperoni', 'cheese', 'bacon']"//<<<---Local
    }
}
```

Notice that the Macro names are considered global, so you can overwrite them id neccessary, so be mindfull how you coordinate your information and use **.global()**

All example in mem.write() apply to mem.write.global()

### mem.read(key)

**mem.read(_key_)** is a Promise and expects the object key you're looking for in Memory_Storage

To make use of this, you'll need to know the key you need to find and use the .then() method to get that key's value

Let's work with the macro called "myMacro"

For Example
```javascript
var memory = {
    "key": "value",
    "myGlobalVar": "[a-zA-Z]",
    "myMacro": {
        "myLocalVar": "$2,000"
    },
    "otherMacro": {
        "icecream": "['chocolate', 'strawberry', 'vanilla']",
        "pizza": "['pepperoni', 'cheese', 'bacon']"
    },
    "myTestMacro": {
        "myInfo": "ABC123" //<<<-- new Information Here!
    }
}
```

We see in storage, there is one key avaiable to use **myLocalVar**

Let's pull that key's value into our script for use, then update it's value using mem.write

