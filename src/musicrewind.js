//class used to represent songs and artists
class Entry {
    constructor(name) {
        this.name = name;
        this.count = 1;
    }
}

//
function rewind() {
    var year = parseInt(document.getElementById("year").value);
    var lines = parseInt(document.getElementById("lines").value);
    var showTotals = document.getElementById("showTotals").checked;
    
    var file = document.getElementById('file').files[0];
    
    var reader = new FileReader();
    reader.onload = (function(theFile) {
        return function(e) {

            var jsonArray = JSON.parse(e.target.result);

            var artists = new Array();
            var songs = new Array();
            //var totalPlays = 0;

            for(i=0; i<jsonArray.length; i++) {
                var jsonObject = jsonArray[i];
                if(jsonObject.header === "YouTube Music" && jsonObject.time.startsWith(year + "-") && jsonObject.title.startsWith("Watched ")) {
                    try {
                        var songName = jsonObject.title.replace("Watched ", "");
                        var artistName = jsonObject.subtitles[0].name.replace(" - Topic", "");

                        if(artistName !== "Music Library Uploads") {
                            var pos = -1;
                            for(j=0; j<artists.length; j++) {
                                if(artists[j].name === artistName) {
                                    pos = j;
                                    break;
                                }
                            }
                            if(pos != -1) {
                                artists[pos].count++;
                            }
                            else {
                                var a = new Entry(artistName);
                                artists.push(a);
                            }
                        }

                        var pos = -1;
                        for(j=0; j<songs.length; j++) {
                            if(songs[j].name === songName) {
                                pos = j;
                                break;
                            }
                        }
                        if(pos != -1) {
                            songs[pos].count++;
                        }
                        else {
                            var s = new Entry(songName);
                            songs.push(s);
                        }
                        //totalPlays++;
                    }
                    catch(err) {
                        //quietly skip it
                    }
                }
            }

            //after for loop
            artists.sort((a,b) => (a.count < b.count) ? 1 : ((b.count < a.count) ? -1 : 0));
            songs.sort((a,b) => (a.count < b.count) ? 1 : ((b.count < a.count) ? -1 : 0));

            var tableCode = "<table class=\"tg\" id=\"results\">\n<thead>\n<tr>\n";
            tableCode += "<th class=\"tg-def\">TOP ARTISTS";
            if(showTotals) {
                tableCode += " <span class = \"gray\">(" + artists.length + ")</span>";
            }
            tableCode += "</th>" + 
            "<th class=\"tg-def\">TOP SONGS";
            if(showTotals) {
                tableCode += " <span class = \"gray\">(" + songs.length + ")</span>";
            }
            tableCode += "</th>\n</tr>\n</thead>\n<tbody>";

            var maxLines = Math.max(Math.min(artists.length,lines),Math.min(songs.length,lines));
            for(i=0; i<maxLines; i++) {
                var num = "" + (i+1);
                if(maxLines >= 10 && num.length == 1) {
                    num = "0" + num;
                }

                var artistName = "&nbsp;";
                try {
                    artistName = artists[i].name;
                }
                catch(err) {
                    //do nothing
                }

                var songName = "&nbsp;";
                try {
                    songName = songs[i].name;
                }
                catch(err) {
                    //do nothing
                }

                tableCode += "<tr>\n";
                tableCode += "<td class=\"tg-def\">";
                if(artistName !== "&nbsp;") {
                    tableCode += "<span class=\"red\">" + num + "</span> " + artistName;
                    if(showTotals) {
                        tableCode += " <span class = \"gray\">(" + artists[i].count + ")</span>";
                    }
                }
				tableCode += "</td>\n";
                tableCode += "<td class=\"tg-def\">";
                if(songName !== "&nbsp;") {
                    tableCode += "<span class=\"red\">" + num + "</span> " + songName;
                    if(showTotals) {
                        tableCode += " <span class = \"gray\">(" + songs[i].count + ")</span>";
                    }
                }
				tableCode += "</td>\n";
				tableCode += "</tr>\n";
            }

            //footer
            tableCode += "<tr>\n"
				+ "<td class=\"tg-footer-left\">pyoro.me/MusicRewind</td>\n"
				+ "<td class=\"tg-footer-right\">&#35;YTMusicRewind</td>\n"
				+ "</tr>\n";
            tableCode += "</tbody>\n</table>";

            document.getElementById("results").outerHTML = tableCode;
            document.getElementById("results_paragraph").style.display = "block";

        };
      })(file);

      //read the JSON file
      reader.readAsText(file);
}

//called when the page loads to set the year input box to the current year
function setYear() {
    document.getElementById("year").setAttribute("value",new Date().getFullYear());
}

//show/hide instructions
function toggleInstructions() {
    var e = document.getElementById("instructions_body");
    if(e.style.display === "none") {
        e.style.display = "block";
    }
    else {
        e.style.display = "none";
    }
}