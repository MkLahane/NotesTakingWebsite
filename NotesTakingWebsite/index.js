"use strict";
$(document).ready(setup);
let entryCount = 0;
let Data = {};
let wasWorkingOn = "null";
let currentEntryCount = 0;
function setup() {
    let sidebar = $('#sidebar');
    let toggleNavbarButton = $('.toggle-btn');
    let toggle = false; 
    let dropFile = $('#dropFile');
    dropFile.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
    });
    dropFile.on('dragover dragenter', function() {
        dropFile.addClass('is-dragover');
    })
    dropFile.on('dragleave dragend drop', function() {
        dropFile.removeClass('is-dragover');
    })
    dropFile.on('drop', function(e) {
        let droppedFiles = e.originalEvent.dataTransfer.files;
        if (!droppedFiles && droppedFiles.length > 1 || droppedFiles.length <= 0)  {
            return; 
        }
        let fr = new FileReader();
        
        fr.onload = function(e) { 
            let result = JSON.parse(e.target.result);
            let data = JSON.stringify(result, null, 2); 
            $('.entry').remove();
            $('.topic').remove();
            Data = result; 
            topicCount = 0; 
            console.log(Data);
            for (let topic in Data) {
                console.log(Data[topic].topicName);
                sidebar.append($('<div class = "topic"><input type = "text" placeholder = "Topic" id = "topic'+topicCount+'" class = "topic"><button class = "minimizeT"><img src = "icons/next.svg" width = "30" height = "30" id = "t'+topicCount+'"></button></div>'));
                sidebar.find('#topic'+topicCount).val(Data[topic].topicName);
                sidebar.append(newSubTopic);
                newSubTopic.css('margin-top', '20px');
                newSubTopic.css('margin-left', '10px');
                topicCount++; 
            }
        }

        fr.readAsText(droppedFiles.item(0));
    });
    
    
    toggleNavbarButton.click(()=> {
        toggle = !toggle;
        if (toggle) {
            sidebar.css('left', '0px');
        } else {
            sidebar.css('left', '-300px');
        }
    });
    
    let newSubTopic = $("#newSubTopic");
    let topicCount = 0;
    let topicData = [];
    
   
    $('.saveButton').hide();
    $('.plusButton').hide();
    
    newSubTopic.click(()=> {
        topicCount++;
        sidebar.append($('<div class = "topic"><input type = "text" placeholder = "Topic" id = "topic'+topicCount+'" class = "topic"><button class = "minimizeT"><img src = "icons/next.svg" width = "30" height = "30" id = "t'+topicCount+'"></button></div>'));
        sidebar.append(newSubTopic);
        newSubTopic.css('margin-top', '20px');
        newSubTopic.css('margin-left', '10px');
        console.log(topicCount);
    });
    
    $('body').on('click', '.minimizeT', showTopic);
    
    $('#newEntry').on('click', addEntry);
    
    $('.saveButton').click(()=> {
        saveCurrentEntries(wasWorkingOn);
        saveData( JSON.stringify(Data), "data.json" );
        console.log(Data); 
    });
    
}

function addAnswer(e) {
    $(this).before($('<input type = "text" placeholder = "Answer" class = "answer">'));
    //console.log(e.target.id);
    console.log(e.target.id.split("entry")[1] - 1);
    Data[wasWorkingOn]["entries"][e.target.id.split("entry")[1] - 1]["answers"].push("");
    $(this).after($(this).parent().parent().children('.minimize'));
    
}





function addEntry(e) {
    currentEntryCount++;
    let entry = $('<div id = "e'+currentEntryCount+'" class = "entry"> <input type = "text" placeholder = "Question" class = "question"> <button class = "plusButton"><img src = "icons/plus.svg" width = "30" height = "30" id = "entry'+currentEntryCount+'"></button><button class = "minimize"><img src = "icons/up-arrow.svg" width = "30" height = "30" id = "h'+currentEntryCount+'"></button></div>');
    $(this).before(entry);
    $(this).after($('.saveButton'));
    let topicValue = $('#'+wasWorkingOn).val();
    topicValue = topicValue == '' ? 'None' : topicValue;
    let entryData = {};
    entryData["question"] = "None";
    entryData["answers"] = []; 
    Data[wasWorkingOn]["entries"].push(entryData);
    let hiding = false; 
    $('.entry').on('click', '#entry'+currentEntryCount, addAnswer);
    $('.entry').on('click', '.minimize', (e)=> {
        let entryNo = e.target.id.split('h')[1];
        hiding = !hiding; 
        let thisEntry = $(this).parent().children().first();
        console.log(entryNo); 
        if (hiding) {
            
            $('#e'+entryNo).find('.answer').hide();
        } else {
            
            $('#e'+entryNo).find('.answer').show();
        }
    });
}

function showTopic(e) {
    console.log( "topic" + e.target.id.split('t')[1]);
    console.log("WasworkingOn:"+wasWorkingOn);
    if (wasWorkingOn != "null") {
        saveCurrentEntries(wasWorkingOn); 
    }
    $('.entry').remove();
    $('.plusButton').show();
    $('.saveButton').show();
    $('.plusButton').after($('.saveButton'));
    currentEntryCount = 0; 
    wasWorkingOn = "topic" + e.target.id.split('t')[1]; 
    if (Data[wasWorkingOn] == undefined) {
        let topicValue = $('#'+wasWorkingOn).val();
        topicValue = topicValue == '' ? 'None' : topicValue;
        let topicData = {};
        topicData['topicName'] = topicValue;
        topicData['entries'] =  [];

        Data[wasWorkingOn] = topicData;
    } else {
        //console.log("###################");
        for (let entryData of Data[wasWorkingOn]["entries"]) {
            currentEntryCount++;
            let entry = $('<div id = "e'+currentEntryCount+'" class = "entry"> <input type = "text" placeholder = "Question" class = "question"> <button class = "plusButton"><img src = "icons/plus.svg" width = "30" height = "30" id = "entry'+currentEntryCount+'"></button><button class = "minimize"><img src = "icons/up-arrow.svg" width = "30" height = "30" id = "h'+currentEntryCount+'"></button></div>');
            $('#newEntry').before(entry);
            entry.children('.question').val(entryData["question"]);
            $('#newEntry').after($('.saveButton'));
            $('.entry').on('click', '#entry'+currentEntryCount, addAnswer);
            
            for (let answer of entryData["answers"]) {
                $('#entry'+currentEntryCount).before($('<input type = "text" placeholder = "Answer" class = "answer">').val(answer));
            }
            let hiding = false; 
            entry.on('click', '.minimize', (e)=> {
                let entryNo = e.target.id.split('h')[1];
                hiding = !hiding; 
                let thisEntry = $(this).parent().children().first();
                console.log(entryNo); 
                if (hiding) {
                    
                    $('#e'+entryNo).find('.answer').hide();
                } else {
                    
                    $('#e'+entryNo).find('.answer').show();
                }
            });
        }
        
    }
    //console.log("CurrentlyWorkingOn"+wasWorkingOn);
    //console.log(Data); 
}


function saveData(data, filename){
    var a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(data));
    a.setAttribute('download', filename);
    a.click();
}



function saveCurrentEntries(wasWorkingOn) {
    let entryCount = 0;
    let topicValue = $('#'+wasWorkingOn).val();
    topicValue = topicValue == '' ? 'None' : topicValue;
    Data[wasWorkingOn]['topicName'] = topicValue;
    for (let entry of $('.entry')) {
        let questionElement = $(entry).children().first();
        let questionVal = questionElement.val();
        questionVal = questionVal == "" ? "None" : questionVal;
        //console.log($(entry).children('.answer'));
        let answers = [];
        for (let answerEle of $(entry).find('.answer')) {
            let answerVal = answerEle.value;
            answerVal = answerVal == "" ? "None" : answerVal;
            answers.push(answerVal);
        }
        //console.log("Answers:"+answers); 
        
        let entryData = {};
        entryData["question"] = questionVal;
        entryData["answers"] = answers;
        //console.log("EntryData:"+entryData); 
        Data[wasWorkingOn]['entries'][entryCount] = entryData; 
        entryCount++;
    }
}






















// saveButton.click(()=> {
        
    //     let data = Data;
    //     let currentEntries = $(".entry");
    //     let currentValue = $('#' + wasWorkingOn).val();
    //     currentValue = currentValue == "" ? "None" : currentValue;
    //     if (data[wasWorkingOn] != undefined) {
            
    //         let currentData = data[wasWorkingOn][currentValue];
    //         let entriesArr = [];
    //         let totalEntries = $('.entry').length;
    //         for (let i = 0; i < totalEntries; i++) {
    //             let dt = {};
    //             let q = $('#entry'+i).children().first().val();
    //             q = q == "" ? "None" : q;
    //             dt[q] = [];
    //             for (let child of $("#entry"+i).children('.answer')) {
    //                 dt[q].push(child.value)
    //             }
    //             entriesArr.push(dt);
    //         }
    //         data[wasWorkingOn][currentTopicValue] = entriesArr;
    //     } else {
    //         let entriesArr = [];
    //         let totalEntries = $('.entry').length;
    //         for (let i = 0; i < totalEntries; i++) {
    //             let dt = {};
    //             let q = $('#entry'+i).children().first().val();
    //             q = q == "" ? "None" : q;
    //             dt[q] = [];
    //             for (let child of $("#entry"+i).children('.answer')) {
    //                 dt[q].push(child.value)
    //             }
    //             entriesArr.push(dt);
    //         }
    //         let newData = {};
    //         newData[currentValue] = entriesArr;
    //         data[wasWorkingOn] = newData;
    //     }
    //     console.log(data);
    //     saveData( JSON.stringify(data), "data.json" );
    // });


    // dropFile.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
    //     e.preventDefault();
    //     e.stopPropagation();
    // });
    // dropFile.on('dragover dragenter', function() {
    //     dropFile.addClass('is-dragover');
    // })
    // dropFile.on('dragleave dragend drop', function() {
    //     dropFile.removeClass('is-dragover');
    // })
    // dropFile.on('drop', function(e) {
    //     let droppedFiles = e.originalEvent.dataTransfer.files;
    //     if (!droppedFiles && droppedFiles.length > 1 || droppedFiles.length <= 0)  {
    //         return; 
    //     }
    //     let fr = new FileReader();

    //     fr.onload = function(e) { 

    //     }

    //     fr.readAsText(droppedFiles.item(0));
    // }); 