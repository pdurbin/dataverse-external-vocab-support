//import { hello } from './module.mjs';
console.log("funders.js..");
//let output = this.libFunders.hello();
//console.log("output: " + output);
var personSelector2 = "span[data-cvoc-protocol='orcid2']";
var personInputSelector2 = "input[data-cvoc-protocol='orcid2']";

$(document).ready(function() {
    expandPeople2();
    updatePeopleInputs2();
});

function expandPeople2() {
    console.log("expandPeople2");
    //Check each selected element
    $(personSelector2).each(function() {
        var personElement = this;
        //If it hasn't already been processed
        if (!$(personElement).hasClass('expanded')) {
            //Mark it as processed
            $(personElement).addClass('expanded');
            var id = personElement.textContent;
            // 27 http://dx.doi.org/10.13039/100000002
            // 18 https://orcid.org/ 
            console.log("id: " + id);
            var justid = id.substring(27);
            console.log("justid: " + justid);
            // can't use "fundingdata" because CORS is not enabled
            //var url = "http://data.crossref.org/fundingdata/funder/10.13039/" + justid;
            // curl http://data.crossref.org/fundingdata/funder/10.13039/100000001 | jq '.prefLabel.Label.literalForm.content'
            //        var name = person.prefLabel.Label.literalForm.content;
            var url = "https://api.crossref.org/funders/" + justid;
            console.log("url: " + url);
            //url = "http://localhost/" + justid;
            /*
            if (id.startsWith("https://orcid.org/")) {
                id = id.substring(18);
            }
            */
            //Try it as an ORCID (could validate that it has the right form and even that it validates as an ORCID, or can just let the GET fail
            $.ajax({
                type: "GET",
                //url: "https://pub.orcid.org/v3.0/" + id + "/person",
                url: url,
                dataType: 'json',
                headers: {
                    'Accept': 'application/json'
                },
                success: function(person, status) {
                    console.log("found data for id " + id);
                    console.log("found data for url " + url);
                    console.log(person);
                    //If found, construct the HTML for display
                    //var name = person.name['family-name'].value + ", " + person.name['given-names'].value;
                    var name = person.message.name;
                    console.log("name: " + name);
                    //var html = "<a href='https://orcid.org/" + id + "' target='_blank' rel='noopener' >" + name + "</a>";
                    var html = "<a href='" + id + "' target='_blank' rel='noopener' >" + name + "</a>";
                    console.log("html: " + html);
                    personElement.innerHTML = html;
                    //If email is public, show it using the jquery popover functionality
                    /*
                    if (person.emails.email.length > 0) {
                        $(personElement).popover({
                            content: person.emails.email[0].email,
                            placement: 'top',
                            template: '<div class="popover" role="tooltip" style="max-width:600px;word-break:break-all"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
                        });
                        personElement.onmouseenter = function() {
                            $(this).popover('show');
                        };
                        personElement.onmouseleave = function() {
                            $(this).popover('hide');
                        };
                    }
                    */
                    //Store the most recent 100 ORCIDs - could cache results, but currently using this just to prioritized recently used ORCIDs in search results
                    if (localStorage.length > 100) {
                        localStorage.removeItem(localStorage.key(0));
                    }
                    localStorage.setItem(id, name);
                },
                failure: function(jqXHR, textStatus, errorThrown) {
                    console.error("The following error occurred... " + textStatus, errorThrown);
                    //Generic logging - don't need to do anything if 404 (leave display as is)
                    if (jqXHR.status != 404) {
                        console.error("The following error occurred: " + textStatus, errorThrown);
                    }
                }
            });
        }
    });
}

function updatePeopleInputs2() {
    //For each input element within personInputSelector elements 
    $(personInputSelector2).each(function() {
        var personInput = this;
        if (!personInput.hasAttribute('data-person')) {
            //Random identifier
            let num = Math.floor(Math.random() * 100000000000);

            //Hide the actual input and give it a data-person number so we can find it
            $(personInput).hide();
            $(personInput).attr('data-person', num);
            //Todo: if not displayed, wait until it is to then create the select 2 with a non-zero width

            //Add a select2 element to allow search and provide a list of choices
            var selectId = "personAddSelect_" + num;
            $(personInput).after(
                '<select id=' + selectId + ' class="form-control add-resource select2" tabindex="-1" aria-hidden="true">');
            $("#" + selectId).select2({
                theme: "classic",
                tags: $(personInput).attr('data-cvoc-allowfreetext'),
                delay: 500,
                templateResult: function(item) {
                    // No need to template the searching text
                    if (item.loading) {
                        return item.text;
                    }

                    //markMatch bolds the search term if/where it appears in the result
                    var $result = markMatch2(item.text, term);
                    return $result;
                },
                templateSelection: function(item) {
                    console.log("5 item.text1: " + item.text);
                    //For a selection, add HTML to make the ORCID a link
                    var pos = item.text.search(/\d{4}-\d{4}-\d{4}-\d{3}[\dX]/);
                    if (pos >= 0) {
                        console.log("pos greater than zero: " + pos);
                        var orcid = item.text.substr(pos, 19);
                        return $('<span></span>').append(item.text.replace(orcid, "<a href='https://orcid.org/" + orcid + "'>" + orcid + "</a>"));
                    }
                    console.log("6 item.text2: " + item.text);
                    // truncate? yes?
                    //return item.text;
                    //return item.text.substring(0,35);
                    //return item.text.substring(0,30);
                    //const maxLength = 25;
                    //const maxLength = 29;
                    //const maxLength = 28;
                    // 27 looks ok in firefox but not chrome, try 26
                    //const maxLength = 27;
                    const maxLength = 26;
                    //length = item.text.length;
                    //if (length < maxLength) {
                    if (item.text.length < maxLength) {
                        // just show the whole name, short enough
                        return item.text;
                    } else {
                        // show the first characters of a long name
                        //return item.text.substring(0,25) + "…";
                        return item.text.substring(0,maxLength) + "…";
                    }

                },
                language: {
                    searching: function(params) {
                        // Change this to be appropriate for your application
                        return 'Search by name, email, or ORCID…';
                    }
                },
                placeholder: personInput.hasAttribute("data-cvoc-placeholder") ? $(personInput).attr('data-cvoc-placeholder') : "Select a funding agency",
                minimumInputLength: 3,
                allowClear: true,
                ajax: {
                    //Use an ajax call to ORCID to retrieve matching results
                    url: function(params) {
                        var term = params.term;
                        if (!term) {
                            term = "";
                        }
                        //Use expanded-search to get the names, email directly in the results
                        //return "https://pub.orcid.org/v3.0/expanded-search";
                        return "https://api.crossref.org/funders";
                        //?query=National+Institutes+of+Health&filter=location:United+States
                    },
                    data: function(params) {
                        term = params.term;
                        console.log("1 term: " + term);
                        if (!term) {
                            term = "";
                            console.log("no term! now, term: " + term);
                        }
                        if (term == "nih") {
                            term = "National Institutes of Health";
                            console.log("2 nih changed to: " + term);
                        }
                        var query = {
                            //q: term,
                            query: term,
                            //query: "NIH",
                            //Currently we just get the top 10 hits. We could get, for example, the top 50, sort as below to put recently used orcids at the top, and then limit to 10
                            rows: 10
                        }
                        return query;
                    },
                    //request json (vs XML default)
                    headers: {
                        'Accept': 'application/json'
                    },
                    processResults: function(data, page) {
                        console.log("3 data dump BEGIN");
                        console.log(data);
                        console.log("3 data dump END");
                        return {
                            //results: data['expanded-result']
                            results: data['message']['items']
                                //Sort to bring recently used ORCIDS to the top of the list
                                .sort((a, b) => (localStorage.getItem(b['orcid-id'])) ? 1 : 0)
                                .map(
                                    function(x) {
                                        console.log("4 function(x)");
                                        return {
                                            /*
                                            text: x['given-names'] + " " + x['family-names'] +
                                                ", " +
                                                x['orcid-id'] +
                                                ((x.email.length > 0) ? ", " + x.email[0] : ""),
                                                */
                                            //text: x['name'] + ", " + x['uri'],
                                            // FIXME: Do we want "name, URL"?
                                            text: x['name'],
                                            // FIXME: truncate?
                                            //text: x['name'].substring(0,20),
                                            //id: x['orcid-id'],
                                            id: x['uri'],
                                            //Since clicking in the selection re-opens the choice list, one has to use a right click/open in new tab/window to view the ORCID page
                                            //Using title to provide that hint as a popup
                                            title: 'Open in new tab to view funding agency'
                                        }
                                    })
                        };
                    }
                }
            });
            //If the input has a value already, format it the same way as if it were a new selection
            var id = $(personInput).val();
            if (id.startsWith("https://orcid.org")) {
                id = id.substring(18);
                $.ajax({
                    type: "GET",
                    url: "https://pub.orcid.org/v3.0/" + id + "/person",
                    dataType: 'json',
                    headers: {
                        'Accept': 'application/json'
                    },
                    success: function(person, status) {
                        var name = person.name['given-names'].value + " " + person.name['family-name'].value;
                        console.log("name: " + name);
                        var text = name + ", " + id;
                        if (person.emails.email.length > 0) {
                            text = text + ", " + person.emails.email[0].email;
                        }
                        var newOption = new Option(text, id, true, true);
                        newOption.title = 'Open in new tab to view ORCID page';
                        $('#' + selectId).append(newOption).trigger('change');
                    },
                    failure: function(jqXHR, textStatus, errorThrown) {
                        if (jqXHR.status != 404) {
                            console.error("The following error occurred: " + textStatus, errorThrown);
                        }
                    }
                });
            } else {
                //If the initial value is not an ORCID (legacy, or if tags are enabled), just display it as is 
                var newOption = new Option(id, id, true, true);
                console.log("newOption: " + newOption);
                $('#' + selectId).append(newOption).trigger('change');
            }
            //Cound start with the selection menu open
            //    $("#" + selectId).select2('open');
            //When a selection is made, set the value of the hidden input field
            $('#' + selectId).on('select2:select', function(e) {
                var data = e.params.data;
                console.log("7 data BEGIN");
                console.log(data);
                console.log("8 data END");
                console.log("9 data.id: " + data.id);
                //For ORCIDs, the id and text are different
                if (data.id != data.text) {
                    // Always here, I guess.
                    console.log("10 data.id != data.text");
                    //$("input[data-person='" + num + "']").val("https://orcid.org/" + data.id);
                    // we want just the funder url
                    $("input[data-person='" + num + "']").val(data.id);
                } else {
                    console.log("10 data.id == data.text");
                    //Tags are allowed, so just enter the text as is
                    $("input[data-person='" + num + "']").val(data.id);
                }
            });
            //When a selection is cleared, clear the hidden input
            $('#' + selectId).on('select2:clear', function(e) {
                $("input[data-person='" + num + "']").attr('value', '');
            });
        }
    });
}

//Put the text in a result that matches the term in a span with class select2-rendered__match that can be styled (e.g. bold)
function markMatch2(text, term) {
    // Find where the match is
    var match = text.toUpperCase().indexOf(term.toUpperCase());
    var $result = $('<span></span>');
    // If there is no match, move on
    if (match < 0) {
        return $result.text(text);
    }

    // Put in whatever text is before the match
    $result.text(text.substring(0, match));

    // Mark the match
    var $match = $('<span class="select2-rendered__match"></span>');
    $match.text(text.substring(match, match + term.length));

    // Append the matching text
    $result.append($match);

    // Put in whatever is after the match
    $result.append(text.substring(match + term.length));

    return $result;
}
