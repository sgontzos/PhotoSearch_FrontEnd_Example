/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Render entities information
 * @param {type} entity
 * @return {undefined}
 */
function show_entity_info(entity) {
    var modalbody = document.getElementsByClassName("modal-body")[0];
    var entitiesContainer = document.getElementById("entities_container");

    var entityLink = document.createElement("a");
    entityLink.id = entity.surfaceForm;
    entityLink.href = entity.uri;
    entityLink.innerHTML = entity.surfaceForm;
    entityLink.style.display = "none";

    var entityInfo = document.createElement("p");
    entityInfo.id = entity.surfaceForm + "_entityInfo";
    entityInfo.innerHTML = entity.abstract;
    entityInfo.style.display = "none";

    var entityInfoButton = document.createElement("button");
    entityInfoButton.id = entity.surfaceForm + "_entityInfoButton";
    entityInfoButton.innerHTML = entity.surfaceForm;

    entityInfoButton.onclick = function () {
        if (entityInfo.style.display === "none" && entityLink.style.display === "none") {
            entityInfo.style.display = "block";
            entityLink.style.display = "block";
        } else {
            entityInfo.style.display = "none";
            entityLink.style.display = "none";
        }
    };

    entitiesContainer.appendChild(entityInfoButton);
    entitiesContainer.appendChild(entityLink);
    entitiesContainer.appendChild(document.createElement("br"));
    entitiesContainer.appendChild(entityInfo);
    entitiesContainer.appendChild(document.createElement("br"));

    modalbody.appendChild(entitiesContainer);
}

/**
 * Create and return all images
 * @param {type} data
 * @return {Array}
 */
function show_images(data) {
    var images = [];
    for (var id in data) {
        images[id] = show_image(data[id], 250, 200);
    }
    return images;
}

/**
 * Create Image and return image
 * @param {type} image
 * @param {type} width
 * @param {type} height
 * @return {undefined|show_image.imgdiv}
 */
function show_image(image, width, height) {
    var imgdiv = document.createElement("div");
    imgdiv.id = image.id;

    var popup = document.createElement("div");
    popup.id = "popup_" + image.id;
    popup.classList.add('popup');
    imgdiv.appendChild(popup);

    var popuptext = document.createElement("span");
    popuptext.id = "popuptext_" + image.id;
    popuptext.classList.add('popuptext');
    popuptext.innerHTML = image.description;
    popup.appendChild(popuptext);

    var img = document.createElement("img");
    img.id = "img_" + image.id;
    img.src = image.link;
    img.width = width;
    img.height = height;
    img.onerror = function () {
        img.src = "images/nonexistent.jpg";
    };
    imgdiv.appendChild(img);

    img.onmouseover = function () {
        var popuptext = document.getElementById("popuptext_" + image.id);
        popuptext.classList.toggle("show");
    };

    img.onmouseout = function () {
        var popuptext = document.getElementById("popuptext_" + image.id);
        popuptext.classList.toggle("show");
    };

    img.onclick = function () {
        $("#photoModal").modal();

        var modalheader = document.getElementsByClassName("modal-header")[0];
        var headercontent = document.createElement("p");
        headercontent.id = "headercontent";
        modalheader.appendChild(headercontent);
        headercontent.innerHTML = image.description;

        var modalbody = document.getElementsByClassName("modal-body")[0];
        var modalimg = document.createElement("img");
        modalimg.id = "modal_img";
        modalimg.src = img.src;
        modalimg.width = img.width;
        modalimg.height = img.height;
        modalbody.appendChild(modalimg);

        var br = document.createElement("div");
        br.id = "br";
        modalbody.appendChild(br);

        var modalimglink = document.createElement("a");
        modalimglink.id = "modal_img_link";
        modalimglink.href = img.src;
        modalimglink.innerHTML = image.linkNL + "<br>";
        modalbody.appendChild(modalimglink);

        extract_entities(image.id);
    };

    return imgdiv;
}

/**
 * Create and return uint of candidate entities identified as radio buttons for
 * the user to choose
 * @param {type} candidate_id
 * @param {type} candidate_value
 * @param {type} candidate_text
 * @return {generate_radio_candidate.candidateUnit|undefined}
 */
function generate_radio_candidate(name, candidate_id, candidate_value, candidate_text) {
    var candidateUnit = document.createElement("div");

    var candidate = document.createElement("input");
    candidate.setAttribute("type", "radio");
    candidate.setAttribute("name", name + "_candidate");
    candidate.setAttribute("id", candidate_id);
    candidate.setAttribute("value", candidate_value);
    candidate.classList.add("candidate");
    candidate.innerHTML = candidate_value;

    var label = document.createElement("label");
    label.setAttribute("for", candidate.id);
    label.innerHTML = candidate_text + "\n";

    candidateUnit.appendChild(candidate);
    candidateUnit.appendChild(label);

    return candidateUnit;
}

/**
 * generate and return the content of the modals regarding to the name entity 
 * identification
 * @param {type} data
 * @param {type} idxSF
 * @return {undefined|generate_dilogue_modal_content.modalcontent}
 */
function generate_dilogue_modal_content(data, idxSF) {
    var modalcontent = document.createElement("div");
    modalcontent.classList.add("modal-content");
    modalcontent.id = "modal-content_" + idxSF;

    var modalheader = document.createElement("div");
    modalheader.classList.add("modal-header");

    var modalbody = document.createElement("div");
    modalbody.classList.add("modal-body");

    var modalfooter = document.createElement("div");
    modalfooter.classList.add("modal-footer");

    var headercontent = document.createElement("p");
    headercontent.id = "headercontent_" + idxSF;

    headercontent.innerHTML = "By " + data[idxSF].name + " which of the following Entities are you refering to?\n";

    var candidates = document.createElement("div");
    candidates.id = "candidates_" + idxSF;

    for (var idxCE in data[idxSF].candidates) {

        var candidateUnit = generate_radio_candidate(data[idxSF].name, "candidate_" + idxCE, data[idxSF].candidates[idxCE].uri, data[idxSF].candidates[idxCE].label);
        candidates.appendChild(candidateUnit);

        if (idxCE === data[idxSF].candidates.length - 1) {
            candidateUnit = generate_radio_candidate("candidate_" + idxCE + 1, "", "None");
            candidates.appendChild(candidateUnit);
        }
    }

    modalbody.appendChild(candidates);

    modalheader.appendChild(headercontent);

    modalcontent.appendChild(modalheader);
    modalcontent.appendChild(modalbody);
    modalcontent.appendChild(modalfooter);

    return modalcontent;
}

/**
 * generate and return modals for named entity identifiation
 * @param {type} data
 * @return {Array|undefined|generate_dialogue.modaldialog}
 */
function generate_dialogue(data) {
    var modaldialog = [];

    for (var idxSF in data) {
        modaldialog[idxSF] = document.createElement("div");
        modaldialog[idxSF].id = "modaldialog_" + idxSF;
        modaldialog[idxSF].classList.add("modal-dialog");

        var modalcontent = generate_dilogue_modal_content(data, idxSF);

        modaldialog[idxSF].appendChild(modalcontent);
    }

    return modaldialog;
}

/**
 * Create and return the button to close all modals regarding to queries entity
 * identification
 * @return {undefined|generate_dialogue_modal_close_button.closeButton}
 */
function generate_dialogue_modal_close_button() {
    var closeButton = document.createElement("button");
    closeButton.id = "closeButton";
    closeButton.innerHTML = "Close";
    closeButton.classList.add("btn");
    closeButton.classList.add("btn-default");
    closeButton.onclick = function () {
        var dialogueModal = document.getElementById("dialogueModal");
        while (dialogueModal.firstChild) {
            dialogueModal.removeChild(dialogueModal.firstChild);
        }
        $('#dialogueModal').modal('hide');
    };

    return closeButton;
}

function generate_dialogue_modal_type_expand_query_button() {
    var expandButton = document.createElement("button");

    expandButton.id = "expandButton_id";
    expandButton.innerHTML = "Advanced Search (type)";
    expandButton.classList.add("btn");
    expandButton.classList.add("btn-default");
    expandButton.onclick = function () {

        var query = document.getElementById("query").value;
        var radios = document.getElementsByClassName("candidate");
        var uris = [];

        for (var id in radios) {
            if (radios[id].checked) {
                uris.push(radios[id].value);
            }
        }

        var dialogueModal = document.getElementById("dialogueModal");

        while (dialogueModal.firstChild) {
            dialogueModal.removeChild(dialogueModal.firstChild);
        }

        $('#dialogueModal').modal('hide');

        var urisString = uris.toString();
        send_query_advanced(query, urisString, "type");
    };

    return expandButton;
}

function generate_dialogue_modal_abstract_expand_query_button() {
    var expandButton = document.createElement("button");

    expandButton.id = "expandButton_abs";
    expandButton.innerHTML = "Advanced Search (abstract)";
    expandButton.classList.add("btn");
    expandButton.classList.add("btn-default");
    expandButton.onclick = function () {

        var query = document.getElementById("query").value;
        var radios = document.getElementsByClassName("candidate");
        var uris = [];

        for (var id in radios) {
            if (radios[id].checked) {
                uris.push(radios[id].value);
            }
        }

        var dialogueModal = document.getElementById("dialogueModal");

        while (dialogueModal.firstChild) {
            dialogueModal.removeChild(dialogueModal.firstChild);
        }

        $('#dialogueModal').modal('hide');

        var urisString = uris.toString();
        send_query_advanced(query, urisString, "abstract");
    };

    return expandButton;
}

/**
 * Basic functionality
 */
$(document).ready(function () {

    $("#sendQuery").click(function () {
        var query = document.getElementById("query").value;
        send_query(query);
    });

    $("#sendAdvancedQuery").click(function () {
        var query = document.getElementById("query").value;
        $("#dialogueModal").modal();
        get_query_candidate_entities(query, "0.0", 0);
    });

    // Remove Photo Modal Content
    $("#photoModal").on("hidden.bs.modal", function () {
        var headercontent = document.getElementById("headercontent");
        headercontent.parentNode.removeChild(headercontent);

        var modalimg = document.getElementById("modal_img");
        modalimg.parentNode.removeChild(modalimg);

        var modalimglink = document.getElementById("modal_img_link");
        modalimglink.parentNode.removeChild(modalimglink);

        var br = document.getElementById("br");
        br.parentNode.removeChild(br);

        var entities_container = document.getElementById("entities_container");
        while (entities_container.firstChild) {
            entities_container.removeChild(entities_container.firstChild);
        }

    });
});

/**
 * AJAX request to send query for advanced search.
 * 
 * @param {type} query
 * @param {type} uris
 * @param {type} expansion
 * @return {undefined}
 */
function send_query_advanced(query, uris, expansion) {
    $.ajax({
        url: "http://localhost:8081/advanced_search",
        type: "GET",
        dataType: 'json',
        data: {
            query: query,
            uris: uris,
            expansion: expansion
        },

        success: function (data, status, xhttp) {

            if (data) {
                $("#photos").html('');
                $("#photos").append(show_images(data));
            } else {
                alert("Something went wrong!");
            }
        }
    });
}

/**
 * AJAX request for geting candidate entities from query
 * @param {type} query
 * @param {type} confidence
 * @param {type} support
 * @return {undefined}
 */
function get_query_candidate_entities(query, confidence, support) {
    $.ajax({
        url: "http://localhost:8081/extract_candidate_entities",
        type: "GET",
        dataType: 'json',
        data: {
            query: query,
            conf: confidence,
            sup: support
        },
        success: function (data, status, xhttp) {
            if (data) {
                $("#dialogueModal").append(generate_dialogue(data));
                $('#dialogueModal').append(generate_dialogue_modal_close_button());
                $('#dialogueModal').append(generate_dialogue_modal_type_expand_query_button());
                $('#dialogueModal').append(generate_dialogue_modal_abstract_expand_query_button());

            } else {
                alert("Something went wrong!");
            }
        }
    });
}

/**
 * AJAX request for search-image query
 * @param {type} query
 * @return {undefined}
 */
function send_query(query) {
    $.ajax({
        url: "http://localhost:8081/search",
        type: "GET",
        dataType: 'json',
        data: {
            query: query
        },

        success: function (data, status, xhttp) {

            if (data) {
                $("#photos").html('');

                if (data.length === 0) {
                    $("#dialogueModal").modal();
                    get_query_candidate_entities(query, "0.0", 0);
                } else {
                    $("#photos").append(show_images(data));
                }
            } else {
                alert("Something went wrong!");
            }
        }
    });
}

/**
 * AJAX request for Identification of Image Entities And other information about
 * the identified entities
 * @param {type} id
 * @return {undefined}
 */
function extract_entities(id) {
    $.ajax({
        url: "http://localhost:8081/extract_entities/" + id,
        type: "GET",
        dataType: 'json',

        success: function (data, status, xhttp) {
            if (data) {
                for (var e in data) {
                    show_entity_info(data[e]);
                }
            } else {
                alert("Something went wrong!");
            }
        }
    });
}

