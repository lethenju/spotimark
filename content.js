/*
MIT License

Copyright (c) 2020 Julien LE THENO

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
*/
let bookmarks = [];
chrome.storage.sync.get(['data'], function(result) {
    if (result.data != undefined) {
        bookmarks = result.data;
    }
});


var jsInitChecktimer = setInterval (checkForJS_Finish, 111);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        jsInitChecktimer = setInterval (checkForJS_Finish, 111);      
  });

function checkForJS_Finish () {
    let rows =document.getElementsByClassName("tracklist-row");  
    if (rows.length > 0) {
        clearInterval (jsInitChecktimer);
 
        let id = 0;
        for (let row of rows) {
            let data = row.getElementsByClassName("tracklist-col name")[0].innerHTML;
            let bookmark = document.getElementById("button-"+id)

            if (bookmark == undefined) {
                bookmark = document.createElement("button");
                bookmark.id = "button-"+id;
            
                bookmark.onclick=  function(){
                    if (bookmark.className=="bookmark-button-active") {
                        // remove the element
                        bookmarks.splice(bookmarks.indexOf(data),1);
                    } else {
                        // add the element   
                        bookmarks.push(data);
                        chrome.storage.sync.set({data: bookmarks});
                    }
                    // Reload the script
                    checkForJS_Finish();
                }
            }
            id++;
            
            
            bookmark.className="bookmark-button"
            // if row is already in data
            if (bookmarks.indexOf(data) != -1 ) {
                bookmark.className="bookmark-button-active"
            }
        
            row.appendChild(bookmark);
        }
      
    

    }
}
