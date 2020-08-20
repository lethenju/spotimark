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

const bookmark_svg_empty = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M336 0H48C21.49 0 0 21.49 0 48v464l192-112 192 112V48c0-26.51-21.49-48-48-48zm0 428.43l-144-84-144 84V54a6 6 0 0 1 6-6h276c3.314 0 6 2.683 6 5.996V428.43z"/></svg>`;
const bookmark_svg_filled = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M0 512V48C0 21.49 21.49 0 48 0h288c26.51 0 48 21.49 48 48v464L192 400 0 512z"/></svg>`;

let bookmarks = [];
chrome.storage.local.get(['data'], function (result) {
    if (result.data != undefined) {
        bookmarks = result.data;
    }
});


var jsInitChecktimer = setInterval(checkForJS_Finish, 111);

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        jsInitChecktimer = setInterval(checkForJS_Finish, 111);
    });

function checkForJS_Finish() {
    let rows = document.getElementsByClassName("tracklist-row");
    if (rows.length > 0) {
        clearInterval(jsInitChecktimer);

        let id = 0;
        for (let row of rows) {
            let data = row.getElementsByClassName("tracklist-col name")[0].innerHTML;
            let bookmark = document.getElementById("button-" + id)


            if (bookmark == undefined) {
                bookmark = document.createElement("button");
                bookmark.id = "button-" + id;

                bookmark.onclick = function () {
                    if (bookmark.className == "bookmark-button-active") {
                        // remove the element
                        bookmark.className = "bookmark-button"
                        bookmark.innerHTML = bookmark_svg_empty;
                        bookmarks.splice(bookmarks.indexOf(data), 1);
                    } else {
                        // add the element   
                        bookmark.className = "bookmark-button-active"
                        bookmark.innerHTML = bookmark_svg_filled;
                        bookmarks.push(data);
                        chrome.storage.local.set({ data: bookmarks });
                    }
                    // Reload the script
                    checkForJS_Finish();
                }
            }
            id++;

            bookmark.className = "bookmark-button"
            bookmark.innerHTML = bookmark_svg_empty;

            // if row is already in data
            if (bookmarks.indexOf(data) != -1) {
                bookmark.className = "bookmark-button-active"
                bookmark.innerHTML = bookmark_svg_filled;
            }

            row.appendChild(bookmark);
        }



    }
}
