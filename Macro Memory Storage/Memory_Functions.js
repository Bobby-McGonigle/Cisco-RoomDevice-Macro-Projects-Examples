/**
 * Author and Project Lead: Zacharie Gignac
 * Co-Author and Tester: Robert McGonigle 
 * 
 * CIFSS - Université Laval
 * Harvard University Information Technology
 * 
 * Released: November 2020
 * Updated: December 2020
 * 
 * Description; Asynchronous read/write permanent memory
 * 
 * Use: Allow the storage of persistent information while working within the Macro editor of Cisco Video Room Devices
 * For more information, please refer to the guide at
 * https://github.com/Bobby-McGonigle/Cisco-RoomDevice-Macro-Projects-Examples/tree/master/Macro%20Memory%20Storage
 */

import xapi from 'xapi';

var config = {
  "storageMacro": "Memory_Storage", //Name for Storage Macro
  "autoImport": "false", //Use: <boolean, "activeOnly">
}

export { mem }

var mem = {}

function getSourceScriptName() {
  var scriptName;
  try {
    var crash = self;
  }
  catch (e) {
    var scriptNameSplit = e.stack.split("[anon]");

    scriptNameSplit.forEach(i => {

      if (i.substring(0, 4) === ' (./' && i.substring(0, 21) !== ' (./Memory_Functions:') {
        scriptName = i.substring(i.indexOf('/') + 1, i.indexOf(':'));
        return;
      }
    });
  }
  return scriptName;
}

function memoryInit() {
  return new Promise((resolve) => {
    xapi.command('macros macro get', {
      Name: config.storageMacro
    }).then(() => {

    }).catch(e => {
      console.warn('Uh-Oh, no storage Macro found, building "' + config.storageMacro)
      xapi.command('macros macro save', {
        Name: config.storageMacro
      },
        `var memory = {\n\t"Warning" : "Do NOT modify this document, as other Scripts/Macros may rely on this information",\n\t"key" : "value"}`
      ).then(() => {
        mem.print.global();
      });

    });
    resolve();
  });
}

function importMem() {
  return new Promise((resolve) => {
    xapi.command('Macros Macro Get', {
      Content: 'True',
    }).then((event) => {
      let regex = /\s*import\s*xapi\s*from\s*'xapi';(\n)*/
      for (let i = 0; i < event.Macro.length; i++) {
        let filter = event.Macro[i].Content.search("Memory_Functions")
        if (filter < 0 && event.Macro[i].Name != 'Memory_Functions') {
          if (event.Macro[i].Name != config.storageMacro) {
            switch (config.autoImport) {
              case true:
              case "true":
                console.log("Added \"import { mem } from './Memory_Functions'\" to Macro: " + event.Macro[i].Name)
                let addImport = event.Macro[i].Content.replace(regex, "import xapi from \'xapi\';\n\nimport { mem } from \'./Memory_Functions\';\n\n")
                xapi.command('Macros Macro Save', {
                  Name: event.Macro[i].Name
                },
                  `${addImport}`
                )
                break;
              case false:
              case "false":

                break;
              case 'activeOnly':
                if (event.Macro[i].Active === 'True') {
                  console.log("Added \"import { mem } from './Memory_Functions'\" to Macro: " + event.Macro[i].Name)
                  let addImport = event.Macro[i].Content.replace(regex, "import xapi from \'xapi\';\n\nimport { mem } from \'./Memory_Functions\';\n\n")
                  xapi.command('Macros Macro Save', {
                    Name: event.Macro[i].Name
                  },
                    `${addImport}`
                  )
                } else {

                }
                break;
              default:
                let error = {
                  "Type": "Configuration Error",
                  "message": "config.autoImport does not accept { " + config.autoImport + " } as a value. Defaulting to false.",
                  "Solution": " Accepted Values for config.autoImport are [true, false, \"activeOnly\"]",
                  "Macro": event.Macro[i].Name
                }
                console.error(error)
                break;
            }
          }
        } else {

        }
      }
    })
    resolve();
  })
}

memoryInit().then(() => {
  importMem();
})

mem.read = function (key) {
  return new Promise((resolve, reject) => {
    let localStore = getSourceScriptName()
    xapi.command('Macros Macro Get', {
      Content: 'True',
      Name: config.storageMacro
    }).then((event) => {
      let raw = event.Macro[0].Content.replace(/var.*memory.*=\s*{/g, '{')
      let store = JSON.parse(raw)
      let temp;
      if (store[localStore] == undefined) {
        store[localStore] = {}
        temp = store[localStore]
      } else {
        temp = store[localStore]
      }
      if (temp[key] != undefined) {
        resolve(temp[key])
      } else {
        reject(new Error('Local Read Error. Object Key: "' + key + '" not found in \'' + config.storageMacro + '\' from script "' + localStore + '"'))
      }
    })
  });
}

mem.read.global = function (key) {
  return new Promise((resolve, reject) => {
    xapi.command('Macros Macro Get', {
      Content: 'True',
      Name: config.storageMacro
    }).then((event) => {
      let raw = event.Macro[0].Content.replace(/var.*memory.*=\s*{/g, '{')
      let store = JSON.parse(raw)
      if (store[key] != undefined) {
        resolve(store[key])
      } else {
        reject(new Error('Global Read Error. Object Key: "' + key + '" not found in \'' + config.storageMacro + '\''))
      }
    })
  });
}

mem.write = function (key, value) {
  return new Promise((resolve) => {
    let localStore = getSourceScriptName()
    xapi.command('Macros Macro Get', {
      Content: 'True',
      Name: config.storageMacro
    }).then((event) => {
      let raw = event.Macro[0].Content.replace(/var.*memory.*=\s*{/g, '{')
      let store = JSON.parse(raw)
      let temp;
      if (store[localStore] == undefined) {
        store[localStore] = {}
        temp = store[localStore]
      } else {
        temp = store[localStore]
      }
      temp[key] = value
      store[localStore] = temp
      let newStore = JSON.stringify(store, null, 4);
      xapi.command('Macros Macro Save', {
        Name: config.storageMacro
      },
        `var memory = ${newStore}`
      ).then(() => {
        console.debug('Local Write Complete => "' + localStore + '" : {"' + key + '" : "' + value + '"}')
        resolve(value);
      });
    })
  })
}

mem.write.global = function (key, value) {
  return new Promise((resolve) => {
    xapi.command('Macros Macro Get', {
      Content: 'True',
      Name: config.storageMacro
    }).then((event) => {
      let raw = event.Macro[0].Content.replace(/var.*memory.*=\s*{/g, '{')
      let store = JSON.parse(raw)
      store[key] = value
      let newStore = JSON.stringify(store, null, 4);
      xapi.command('Macros Macro Save', {
        Name: config.storageMacro
      },
        `var memory = ${newStore}`
      ).then(() => {
        console.debug('Global Write Complete => "' + config.storageMacro + '" : {"' + key + '" : "' + value + '"}')
        resolve(value);
      });
    })
  });
}

mem.remove = function (key) {
  return new Promise((resolve, reject) => {
    let localStore = getSourceScriptName()
    xapi.command('Macros Macro Get', {
      Content: 'True',
      Name: config.storageMacro
    }).then((event) => {
      let raw = event.Macro[0].Content.replace(/var.*memory.*=\s*{/g, '{')
      let store = JSON.parse(raw)
      let temp;
      if (store[localStore] == undefined) {
        store[localStore] = {}
        temp = store[localStore]
      } else {
        temp = store[localStore]
      }
      if (temp[key] != undefined) {
        let track = temp[key]
        delete (temp[key])
        store[localStore] = temp
        let newStore = JSON.stringify(store);
        xapi.command('Macros Macro Save', {
          Name: config.storageMacro
        },
          `var memory = ${newStore}`
        ).then(() => {
          console.warn('WARNING: Local Object Key {"' + key + '" : "' + track + '"} has been deleted from ' + config.storageMacro + '. Deletion occurred in script "' + localStore + '"')
          resolve(key);
        });
      } else {
        reject(new Error('Local Delete Error. Object Key: "' + key + '" not found under Object "' + localStore + '{}" in "' + config.storageMacro + '"'))
      }
    })
  });
}

mem.remove.global = function (key) {
  return new Promise((resolve, reject) => {
    xapi.command('Macros Macro Get', {
      Content: 'True',
      Name: config.storageMacro
    }).then((event) => {
      let raw = event.Macro[0].Content.replace(/var.*memory.*=\s*{/g, '{')
      let store = JSON.parse(raw)
      if (store[key] != undefined) {
        let track = store[key]
        delete (store[key])
        let newStore = JSON.stringify(store, null, 4);
        xapi.command('Macros Macro Save', {
          Name: config.storageMacro
        },
          `var memory = ${newStore}`
        ).then(() => {
          console.warn('WARNING: Global Object Key {"' + key + '" : "' + track + '"} has been deleted from ' + config.storageMacro + '. Deletion occurred in script "' + getSourceScriptName() + '"')
          resolve(key);
        });
      } else {
        reject(new Error('Global Delete Error. Object Key: "' + key + '" not found in "' + config.storageMacro + '"'))
      }
    })
  });
}

mem.print = function () {
  mem.read.global(getSourceScriptName()).then((log) => {
    console.log(log)
  }).catch(e => new Error('Local Print Error: No local key found in "' + config.storageMacro + '"'))
}

mem.print.global = function () {
  xapi.command('Macros Macro Get', {
    Content: 'True',
    Name: config.storageMacro
  }).then((event) => {
    let raw = event.Macro[0].Content.replace(/var.*memory.*=\s*{/g, '{')
    let store = JSON.parse(raw)
    console.log(store)
  })
}
