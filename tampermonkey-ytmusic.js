// ==UserScript==
// @name         spm->node
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Send song info to Node.js server and reload page on change
// @author       alan_alexander1011
// @match        https://music.youtube.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// ==/UserScript==

/*
MIT/GU-NNoA-LF License

Copyright (c) 2023-now alan-alexander-1011

(Copyright was added by the owner too :) not too much force but pls give creds 
when showing this to the public or distribute it)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

After the MIT License, the name of the owner("alan-alexander-1011") *Shall Not* be used to
make money or in advertisement or to make any deals that is related to this software because
the software is *100%* free.

The program IS NOT for sale, but for normal and commercial uses.

The Distributor of this software is not needed to show the code of the program to the public. 
But the Distributor of this software may needed to give an simple explanation of what the 
Distributor added/modified to the program.
And the distributor may give the owner credits.

-----------------------------------------
Notes after the terms:
-----------------------------------------
*/

(async function() {
  'use strict';

  let lastTitle = await GM.getValue('lastTitle', '');

  function sendCurrentSong() {
      const artist = document.querySelector('.byline.ytmusic-player-bar')?.innerText || 'Unknown Artist';
      const title = document.querySelector('.title.ytmusic-player-bar')?.innerText || 'Unknown Title';
      const time = document.querySelector('.time-info.style-scope.ytmusic-player-bar')?.innerText || 'unknown time';
      // Prepare song info object
      const songInfo = artist === '' && title === '' && time === ''
          ? { artist: 'unknown', title: 'unknown', time: 'unknown' }
          : { artist, title, time };


      GM.xmlHttpRequest({
          method: "POST",
          url: "http://localhost:37373/current_song",
          data: JSON.stringify(songInfo),
          headers: {
              "Content-Type": "application/json"
          },
          onload: function(response) {
              const responseText = JSON.parse(response.responseText);
              if (responseText.title !== lastTitle) {
                  lastTitle = responseText.title;
                  GM.setValue('lastTitle', lastTitle);

                  GM.xmlHttpRequest({
                      method: "POST",
                      url: "http://localhost:37373/reload",
                      headers: {
                          "Content-Type": "application/json"
                      }
                  });
              }
          }
      });
  }

  setInterval(sendCurrentSong, 250);
})();
