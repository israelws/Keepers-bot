// Initialize app
var myApp = new Framework7();

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;


// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});

//relevant variables
var Titles = [];
var Contents = [];
var Question = [];
var Answers = [];
var Next = [];
var Back = [];

/*function makeApiCall() {
    var params = {
        // The ID of the spreadsheet to retrieve data from.
        spreadsheetId: '16oXmBaKcVvEzv_5421m5FgjuVYE7C7wUytzL8_2A7w0',  // TODO: Update placeholder value.
        //spreadsheetId: '19mGKx7aMqjc_bSVCJ_04tnwTAguLLGK5kPrkF7wI4jE',  // TODO: Update placeholder value.
        // The A1 notation of the values to retrieve.
        range: 'B2:J9',  // TODO: Update placeholder value.
        // How values should be represented in the output.
        // The default render option is ValueRenderOption.FORMATTED_VALUE.
        valueRenderOption: 'FORMATTED_VALUE',  // TODO: Update placeholder value.
        // How dates, times, and durations should be represented in the output.
        // This is ignored if value_render_option is
        // FORMATTED_VALUE.
        // The default dateTime render option is [DateTimeRenderOption.SERIAL_NUMBER].
        dateTimeRenderOption: 'SERIAL_NUMBER',  // TODO: Update placeholder value.
        majorDimension: 'ROWS',
    };

    var request = gapi.client.sheets.spreadsheets.values.get(params);

    request.then(function(response) {
        // TODO: Change code below to process the `response` object:
        stringParse(response.result.values);
        console.log(response.result);
    }, function(reason) {
        console.error('error: ' + reason.result.error.message);
    });
}*/

// ------------------------------------------------------------------------------------------------------------------
//This function is my main addition to this code.  It is meant to take in the relevant data and format it for later use
function stringParse(info){
    // Local varibales that are used to hold temp information.
    var AnswersList = [];
    var NextList = [];
    //loops through information given to format it
    for(i = 0; i < info.length; i++){
        // Pushes all of the titles, contents, and questions into one list
        this.Titles.push(info[i][0]);
        this.Contents.push(info[i][1]);
        this.Question.push(info[i][2]);

        // Pushes all of the answers into one list
        for(q = 3; q < info[i].length; q++){
            AnswersList.push(info[i][q].slice(0, info[i][q].length - 3));
            NextList.push(parseInt(info[i][q].slice(info[i][q].length - 2, info[i][q].length - 1)));
        }

        // Checks to see if there are any answers listed in the row
        this.Answers.push(AnswersList);
        this.Next.push(NextList);
        AnswersList = [];
        NextList = [];
    }
    
    // Starts to output the first node in the decision tree.
    nodeOutput(0);
}

// ------------------------------------------------------------------------------------------------------------------
function nodeOutput(index) {
    var textOutput = [];
    
    // if(index == 0 && document.getElementById('backButton').disabled == false)
    //     document.getElementById('backButton').disabled = true;
    // else if(index != 0 && document.getElementById('backButton').disabled == true)
    //     document.getElementById('backButton').disabled = false;

    // Output the title inside the title at the html.
    document.getElementById('title').innerHTML = Titles[index];

    // Output the content and question inside the text at the html.
    if (Answers[index][2]) {
        textOutput = Contents[index] + "</br>" + Question[index];
    }

    else{
        textOutput = Contents[index];
    }

    document.getElementById('text').innerHTML = textOutput;   
    
    clearButtons();
    
    // Creates answer buttons.
    if(Answers[index]) {
        for(i = 0; i < Answers[index].length; i++)
        {
            var button = document.createElement("button");
            button.innerHTML = Answers[index][i];
            button.id = i;
            button.class = "buttons";
            var answers = document.getElementById("answers");
            answers.appendChild(button);
            button.addEventListener ("click", function() {
                var temp = Next[index][this.id];
                Back.push(index);      
                nodeOutput(temp-1);
            });
        }
    }
}

// ------------------------------------------------------------------------------------------------------------------
// Clear the buttons from the screen when needed.
function clearButtons(){
  var length = document.getElementById('answers').childElementCount;
  var div =  document.getElementById('answers');
  for(i=0; i<length; i++){
     div.removeChild(document.getElementById(i));
  }
}


// ------------------------------------------------------------------------------------------------------------------
// Initiates the client
/*function initClient() {
    var API_KEY = 'AIzaSyDfXNTAOiF2foSfcXh-zrhJpuZkZmqwVak';  // TODO: Update placeholder with desired API key.
    
    //var API_KEY = 'AIzaSyD1548_G7dQRFH7us5ziBpOp-DRRQ3w1yk';  // TODO: Update placeholder with desired API key.
    var CLIENT_ID = '264708841934-nceklkm8rbtougbded3ihr25cr1v30lq.apps.googleusercontent.com';  // TODO: Update placeholder with desired client ID.
    //var CLIENT_ID = '371986161218-v1ejafinod0idod1dl5jll2nrap36q5o.apps.googleusercontent.com';  // TODO: Update placeholder with desired client ID.
    // TODO: Authorize using one of the following scopes:
    //   'https://www.googleapis.com/auth/drive'
    //   'https://www.googleapis.com/auth/drive.file'
    //   'https://www.googleapis.com/auth/drive.readonly'
    //   'https://www.googleapis.com/auth/spreadsheets'
    //   'https://www.googleapis.com/auth/spreadsheets.readonly'
    var SCOPE = 'https://www.googleapis.com/auth/spreadsheets.readonly';
    gapi.client.init({
        'apiKey': API_KEY,
        'clientId': CLIENT_ID,
        'scope': SCOPE,
        'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    }).then(function() {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
        updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}*/

// ------------------------------------------------------------------------------------------------------------------
// Loads the client so that a user may log in
/*function handleClientLoad() {
    gapi.load('client:auth2', initClient);
    setTimeout(function(){
        handleSignIn();
    },5000);    
}*/

function handleClientLoad() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "https://sheets.googleapis.com/v4/spreadsheets/16oXmBaKcVvEzv_5421m5FgjuVYE7C7wUytzL8_2A7w0/values/B2:J9?key=AIzaSyDfXNTAOiF2foSfcXh-zrhJpuZkZmqwVak", true);       
    xhr.send();
    xhr.onreadystatechange = function (e){
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            stringParse(response.values);
        }
    }
}
 
// ------------------------------------------------------------------------------------------------------------------
// Grabs the data if the user is signed in
/*function updateSignInStatus(isSignedIn) {
    if (isSignedIn)
        makeApiCall();
}*/
 
 // ------------------------------------------------------------------------------------------------------------------
 //signs in a user
/*function handleSignIn() {
    gapi.auth2.getAuthInstance().signIn();
}*/

 
// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page

})

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'about') {
        // Following code will be executed for page with data-page attribute equal to "about"
        myApp.alert('Here comes About page');
    }
})

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    myApp.alert('Here comes About page');
})