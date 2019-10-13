'use strict';

const electron 	  = require('electron');
const {app,shell} = electron;

// Menu Template
exports.template = [
      {
        label: 'File',
        submenu: [
	        {
	          label: 'Quit',
	          accelerator: 'CmdOrCtrl+Q',
	          click: function() { app.quit(); }
	        }]
      },
    {
      label: 'View',
      submenu: [
        {
          role: 'reload',
        },
        {
          role: 'forcereload',
        },
        {
          role: 'toggledevtools',
        },
        {
          type: 'separator',
        },
        {
          role: 'resetzoom',
        },
        {
          role: 'zoomin',
        },
        {
          role: 'zoomout',
        },
        {
          type: 'separator',
        },
        {
          role: 'togglefullscreen',
        }
      ]
    },
       {
        role: 'help',
        submenu: [
          {
            label: 'Contact Developer',
            click () { shell.openExternal('https://www.linkedin.com/in/ashok-devatwal/') }
          }
        ]
      },
      {
        label: 'App',
        submenu: [
          {
            label: 'Check For Update',
            click () { shell.openExternal('https://www.linkedin.com/in/ashok-devatwal/') }
          }
        ]
      }
    ]
