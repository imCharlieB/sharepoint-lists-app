
$(document).ready(function () {
    console.log("Ready for action");
    //createList();
    //addField();
    //createListItem();
    //readItems();
    $("input[id$='ButtonCreateList']").click(createList);
    $("input[id$='ButtonAddFields']").click(addField);
    $("input[id$='ButtonAddItem']").click(createListItem);
    $("input[id$='ButtonReadItems']").click(readItems);
});

// Script for creating internal list.
function createList() {
    var clientContext = SP.ClientContext.get_current();
    var oWebsite = clientContext.get_web();
    var listCreationInfo = new SP.ListCreationInformation();
    listCreationInfo.set_title("My Favorite Books");
    listCreationInfo.set_templateType(SP.ListTemplateType.genericList);
    var oList = oWebsite.get_lists().add(listCreationInfo);
    clientContext.load(oList);
    clientContext.executeQueryAsync(
      successHandler,
       errorHandler
    );
    function successHandler() {
        $("#infoLabel").text("<My Favorite Books> list has been created!");
        console.log("List successfully created.");
    }
    function errorHandler() {
        $("#infoLabel").text("<My Favorite Books> list already exist!");
        console.log("List already created, not creating new one.");
    }
}

// Script for adding field to list.
function addField() {
    var clientContext = SP.ClientContext.get_current();
    var oWebsite = clientContext.get_web();
    var oList = oWebsite.get_lists().getByTitle("My Favorite Books");
    var oField = oList.get_fields().addFieldAsXml(
        "<Field DisplayName='Price' Type='Number' />",
        true,
        SP.AddFieldOptions.defaultValue
    );
    var fieldNumber = clientContext.castTo(oField, SP.FieldNumber);
    fieldNumber.set_maximumValue(100);
    fieldNumber.set_minimumValue(1);
    fieldNumber.update();
    clientContext.load(oField);
    clientContext.executeQueryAsync(
      successHandler,
       errorHandler
    );
    function successHandler() {
        $("#infoLabel").text("New field added to list!");
        console.log("Field successfully added.");
    }
    function errorHandler() {
        $("#infoLabel").text("Field not added to list!");
        console.log("Field has not been added.");
    }
}

// Script for adding items to list.
function createListItem() {
    var clientContext = SP.ClientContext.get_current();
    var oWebsite = clientContext.get_web();
    var oList = oWebsite.get_lists().getByTitle("My Favorite Books");
    var itemCreateInfo = new SP.ListItemCreationInformation();
    var oListItem = oList.addItem(itemCreateInfo);
    oListItem.set_item("Title", "My New Item!");
    oListItem.set_item("MyField", 1);
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
function readItems() {
    var clientContext = SP.ClientContext.get_current();
    var oWebsite = clientContext.get_web();
    var oList = oWebsite.get_lists().getByTitle("My Favorite Books");
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
                "MyField: " + oListItem.get_item("MyField") + "<br/>";
        }
        $("#infoLabel").text("Items read from list:" + listItemInfo);
        console.log("Items successfully read: " + listItemInfo);
    }
    function errorHandler() {
        $("#infoLabel").text("Problem while reading items.");
        console.log("Problem while reading items: " + arguments[1].get_message());
    }
}

