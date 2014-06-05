
$(document).ready(function () {
    console.log("Ready for action");
    //createList();
    //addField();
    //createListItem();
    //readItems();
    findLists();
    $("input[id$='Button_NewList']").click(newList);
    $("input[id$='Button_NewField']").click(addField);
    $("input[id$='Button_AddItem']").click(createListItem);
    $("input[id$='Button_FindItems']").click(findItems);
});

// Script for creating internal list.
function newList() {
    var newlistname = $("#TextBox_NewListName").val();
    var clientContext = SP.ClientContext.get_current();
    var oWebsite = clientContext.get_web();
    var listCreationInfo = new SP.ListCreationInformation();
    listCreationInfo.set_title(newlistname);
    listCreationInfo.set_templateType(SP.ListTemplateType.genericList);
    var oList = oWebsite.get_lists().add(listCreationInfo);
    clientContext.load(oList);
    clientContext.executeQueryAsync(
      successHandler,
       errorHandler
    );
    function successHandler() {
        $("#infoLabel").text(newlistname + " list has been created!");
        console.log("List successfully created.");
    }
    function errorHandler() {
        $("#infoLabel").text("<My Favorite Books> list already exist!");
        console.log("List already created, not creating new one.");
    }
}

// Script for adding field to list.
function addField() {
    var newfieldname = $("#TextBox_NewFieldName").val();
    var newlistname = $("#TextBox_NewListName").val();
    var clientContext = SP.ClientContext.get_current();
    var oWebsite = clientContext.get_web();
    var oList = oWebsite.get_lists().getByTitle(newlistname);
    var oField = oList.get_fields().addFieldAsXml(
        "<Field DisplayName='" + newfieldname + "' Type='Text' />",
        true,
        SP.AddFieldOptions.defaultValue
    );
    var field = clientContext.castTo(oField, SP.FieldText);
    field.set_required(true);
    field.set_maxLength(100);
    field.update();
    clientContext.load(oField);
    clientContext.executeQueryAsync(
      successHandler,
       errorHandler
    );
    function successHandler() {
        $("#infoLabel").text("New field added to list: " + newfieldname);
        console.log("Field successfully added: " + newfieldname);
    }
    function errorHandler() {
        $("#infoLabel").text("Field not added to list!");
        console.log("Field has not been added.");
    }
}

// Script for adding items to list.
function createListItem() {
    var newlistname = $("#TextBox_NewListName").val();
    var newItemTitle = $("#TextBox_NewItemTitle").val();
    var clientContext = SP.ClientContext.get_current();
    var oWebsite = clientContext.get_web();
    var oList = oWebsite.get_lists().getByTitle(newlistname);
    var itemCreateInfo = new SP.ListItemCreationInformation();
    var oListItem = oList.addItem(itemCreateInfo);
    oListItem.set_item("Title", newItemTitle);
    //oListItem.set_item("MyField", 1);
    oListItem.update();
    clientContext.load(oListItem);
    clientContext.executeQueryAsync(
      successHandler,
       errorHandler
    );
    function successHandler() {
        $("#infoLabel").text("New item added to list!");
        console.log("Item successfully added.");
    }
    function errorHandler() {
        $("#infoLabel").text("Problem while adding item.");
        console.log("Item not added: " + arguments[1].get_message());
    }
}

// Script for reading list items.
function findItems() {
    var newlistname = $("#TextBox_NewListName").val();
    var clientContext = SP.ClientContext.get_current();
    var oWebsite = clientContext.get_web();
    var oList = oWebsite.get_lists().getByTitle(newlistname);
    var camlQuery = new SP.CamlQuery();
    camlQuery.set_viewXml(
        '<View><Query><Where><Geq><FieldRef Name=\'ID\'/>' +
        '<Value Type=\'Number\'>1</Value></Geq></Where></Query>' +
        '<RowLimit>10</RowLimit></View>'
    );
    var collListItem = oList.getItems(camlQuery);
    clientContext.load(collListItem);
    clientContext.executeQueryAsync(
      successHandler,
       errorHandler
    );
    function successHandler() {
        var listItemEnumerator = collListItem.getEnumerator();
        var listItemInfo = "";
        while (listItemEnumerator.moveNext()) {
            var oListItem = listItemEnumerator.get_current();
                listItemInfo += "ID: " + oListItem.get_id() + "<br/>" +
                    "Title: " + oListItem.get_item("Title") + "<br/>" +
                    "ASIN: " + oListItem.get_item("ASIN") + "<br/>";
            
        }
        $("#searchResults").html("Items read from list:<br>" + listItemInfo);
        console.log("Items successfully read: " + listItemInfo);
    }
    function errorHandler() {
        $("#searchResults").html("Problem while reading items.");
        console.log("Problem while reading items: " + arguments[1].get_message());
    }
}

// Script for reading all lists.
function findLists() {
    var clientContext = SP.ClientContext.get_current();
    var oWebsite = clientContext.get_web();
    var collList = oWebsite.get_lists();
    var listInfoCollection = clientContext.loadQuery(collList, "Include(Title, Id)");
    clientContext.executeQueryAsync(successHandler, errorHandler);
    function successHandler() {
        var listInfo = "";
        for (var i = 0; i < listInfoCollection.length; i++) {
            var oList = listInfoCollection[i];
            listInfo += "Title: " + oList.get_title() +
                " ID: " + oList.get_id().toString() + "<br/>";
        }
        $("#infoLabel").text("Found all lists:" + listInfo);
        console.log("Found lists: " + listInfo);
    }
    function errorHandler() {
        $("#infoLabel").text("Problem finding lists: " + arguments[1].get_message());
        console.log("Problem finding lists: " + arguments[1].get_message());
    }
}