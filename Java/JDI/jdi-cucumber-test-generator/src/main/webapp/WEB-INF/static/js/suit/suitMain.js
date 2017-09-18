var suit_id = -1;
var case_id = -1;

$(document).ready(function () {
    $('.accordion-tabs').children('li').first().children('div').addClass('is-active').next().addClass('is-open').show();
    $('.accordion-tabs').on('click', 'li > div', function(event) {
        if (!$(this).hasClass('is-active')) {
            event.preventDefault();
            $('.accordion-tabs .is-open').removeClass('is-open').hide();
            $(this).next().toggleClass('is-open').toggle();
            $('.accordion-tabs').find('.is-active').removeClass('is-active');
            $(this).addClass('is-active');
        } else {
            event.preventDefault();
        }
    });

    $("#cases_table_body").on("click", "tr", function(){
        $("#cases_table_body").children("tr").removeClass("is_active");
        $(this).addClass("is_active");
        case_id = $(this).children("td.small_td").children(".particular_caseId").val();
        $("#code-textarea").val("");
        $("#case-description-textfield").val("");
        $("#case-priority-textfield").val("");
        getCaseInfo();
    });

    $("#files").change(function(){
        var sourceVal = document.getElementById("files").files[0].path;
        alert(sourceVal);
//        var blob = new Blob(["test text"], {type: "text/plain;charset=utf-8"});
//        saveAs(blob, fileName);
    })


    $("#tableCases").tablesorter({
        theme: 'blue',
        headers: {
            0: {
                sorter: false
            },
            1: {
              sorter: "text"
            },
            3: {
                sorter: false
            }
        },
        widgets: ['stickyHeaders', 'zebra'],
        widgetOptions: {
            // jQuery selector or object to attach sticky header to
            stickyHeaders_attachTo : '.cases-table-container' // or $('.wrapper')
        }
    });

});

function getSuitInfo(suitId){
    $.get("/cucumber/suit/" + suitId, function(response){
        suit_id = response.id;
        $("#nameSuit").text(response.name);
        $("#descriptionSuit").text((response.description != "") ? response.description  : "-" );
        $("#prioritySuit").text(response.priority);
        $("#createDateSuit").text(response.creationDate);
        $("#tagsSuit").text((response.tags != "") ? response.tags : "-" );
        $("#countCases").text(response.cases.length);
        $("#code-textarea").val("");
        $("#case-description-textfield").val("");
        $("#case-priority-selector").val("");
        $("#case-create-date").val("");
        $("#case-tags").val("");
        $("#steps_container").empty();
        $("#cases_table_body").empty();
        
        for(var i = 0; i < response.cases.length; i++){
            $("#cases_table_body").append($('<tr>')
                                .append($('<td>')
                                    .addClass('small_td')
                                    .append($('<input>')
                                        .attr('type', 'checkbox')
                                    )
                                    .append($('<input>')
                                        .addClass('particular_caseId')
                                        .attr('type', 'hidden')
                                        .val(response.cases[i].id)
                                    )
                                )
                                .append($('<td>')
                                    .text(response.cases[i].description)
                                ).append($('<td>')
                                    .text(response.cases[i].priority)
                                ).append($('<td>')
                                    .text(response.cases[i].tags)
                                ).append($('<td>')
                                    .text(response.cases[i].creationDate)
                                )
                            );
        }

        $('.tablesorter').trigger('update');
    });

    disableCaseButtons();
}

function getSuitInfoWithOutCleanCases(suitId){
    $.get("/cucumber/suit/" + suitId, function(response){
        suit_id = response.id;
        $("#nameSuit").text(response.name);
        $("#descriptionSuit").text((response.description != "") ? response.description  : "-" );
        $("#prioritySuit").text(response.priority);
        $("#createDateSuit").text(response.creationDate);
        $("#tagsSuit").text((response.tags != "") ? response.tags : "-" );
        $("#countCases").text(response.cases.length);
        $("#cases_table_body").empty();
        for(var i = 0; i < response.cases.length; i++){
            $("#cases_table_body").append($('<tr>')
                                .append($('<td>')
                                    .addClass('small_td')
                                    .append($('<input>')
                                        .attr('type', 'checkbox')
                                    )
                                    .append($('<input>')
                                        .addClass('particular_caseId')
                                        .attr('type', 'hidden')
                                        .val(response.cases[i].id)
                                    )
                                )
                                .append($('<td>')
                                    .text(response.cases[i].description)
                                )
                            );
        }

        $('.tablesorter').trigger('update');
    });


    disableCaseButtons();
}

function getCaseInfo(){
    $.get("/cucumber/suit/" + suit_id + "/case/" + case_id, function(response){
        $("#case-description-textfield").val(response.description);
        $("#case-priority-selector").val(response.priority);
        $("#case-create-date").val(response.creationDate);
        $("#case-tags").val(response.tags);
        $("#steps_container").empty();
        for(var i = 0; i < response.steps.length; i++){
            $("#steps_container").append("<div class=\"sortable-step-container\">\n" +
            "\n" +
            "                                            <div class=\"step-info-handle\">\n" +
            "                                                <div style=\"margin: 0; border: 1px dotted gray; width: 620px; float: left; padding: 5px;\">\n" +
            "                                                    <div class=\"select-step-type-container\">\n" +
            "                                                        <select class=\"step-type-select-tag\">\n" +
            "                                                            <option value=\"0\" disabled selected>-----</option>\n" +
            "                                                            <option value=\"1\">Given</option>\n" +
            "                                                            <option value=\"2\">When</option>\n" +
            "                                                            <option value=\"3\">Then</option>\n" +
            "                                                            <option value=\"4\">And</option>\n" +
            "                                                            <option value=\"5\">But</option>\n" +
            "                                                        </select>\n" +
            "                                                    </div>\n" +
            "\n" +
            "                                                   <input type=\"text\" class=\"step-code-line\" value='" + response.steps[i].description + "'>\n" +
            "\n" +
            "                                                    <div style=\"clear: both; width: 0px;\"></div>\n" +
            "                                                </div>\n" +
            "\n" +
            "                                                <img src=\"/static/images/deleteStep-icon.png\" class=\"delete-step-icon\">\n" +
            "                                            </div>\n" +
            "                                            <div style=\"clear: both\"></div>\n" +
            "\n" +
            "                                            <div class=\"adding-new-step-div\">\n" +
            "                                                <img src=\"/static/images/addRow-icon.png\" class=\"add-step-icon\">\n" +
            "                                            </div>\n" +
            "                                        </div>");
            $($(".step-type-select-tag")[i]).val(response.steps[i].type);
        }
        if(response.steps.length == 0){
            $("#steps_container").append("<div class=\"sortable-step-container\">\n" +
                            "\n" +
                            "                                            <div class=\"step-info-handle\">\n" +
                            "                                                <div style=\"margin: 0; border: 1px dotted gray; width: 620px; float: left; padding: 5px;\">\n" +
                            "                                                    <div class=\"select-step-type-container\">\n" +
                            "                                                        <select class=\"step-type-select-tag\">\n" +
                            "                                                            <option value=\"0\" disabled selected>-----</option>\n" +
                            "                                                            <option value=\"1\">Given</option>\n" +
                            "                                                            <option value=\"2\">When</option>\n" +
                            "                                                            <option value=\"3\">Then</option>\n" +
                            "                                                            <option value=\"4\">And</option>\n" +
                            "                                                            <option value=\"5\">But</option>\n" +
                            "                                                        </select>\n" +
                            "                                                    </div>\n" +
                            "\n" +
                            "                                                   <input type=\"text\" class=\"step-code-line\">\n" +
                            "\n" +
                            "                                                    <div style=\"clear: both; width: 0px;\"></div>\n" +
                            "                                                </div>\n" +
                            "\n" +
                            "                                                <img src=\"/static/images/deleteStep-icon.png\" class=\"delete-step-icon\">\n" +
                            "                                            </div>\n" +
                            "                                            <div style=\"clear: both\"></div>\n" +
                            "\n" +
                            "                                            <div class=\"adding-new-step-div\">\n" +
                            "                                                <img src=\"/static/images/addRow-icon.png\" class=\"add-step-icon\">\n" +
                            "                                            </div>\n" +
                            "                                        </div>");
            }
    });
}