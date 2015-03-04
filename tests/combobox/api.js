(function() {

var data = [{text: "Foo", value: 1}, {text:"Bar", value:2}];

var ComboBox = kendo.ui.ComboBox;

var SELECTED = "k-state-selected";
var keys = kendo.keys;
var select;
var input;

module("kendo.ui.ComboBox selection", {
    setup: function() {
        input = $("<input />").appendTo(QUnit.fixture);
    },
    teardown: function() {
        var combo = input.data("kendoComboBox");

        if (combo) {
            combo.destroy();
            input = null;
        }

        if (select) {
            select.data("kendoComboBox").destroy();
            select = null;
        }
        kendo.destroy(QUnit.fixture);
    }
});

test("open() method should open popup {autobind: true}", function() {
    var combobox = new ComboBox(input, {
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [{text: "foo", value: 1}, {text:2, value:2}]
    });

    combobox.open();

    ok(combobox.popup.visible());
});

test("open() method should bind and open popup {autobind: false}", function() {
    var combobox = new ComboBox(input, {
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [{text: "foo", value: 1}, {text:2, value:2}],
        autoBind: false
    });

    combobox.open();

    ok(combobox.popup.visible());
});

test("open() does not initiate second Ajax request", function() {
    $.mockjaxSettings.responseTime = 1000; //TODO: set to 0
    $.mockjaxSettings.contentType = "text/html";
    $.mockjax({ url: "fake.json", responseText: [] });

    var combobox = new ComboBox(input, {
        autoBind: false,
        dataSource: {
            transport: {
                read: { url: "fake.json", dataType: "json" }
            }
        }
    });

    stub(combobox.dataSource, {
        fetch: combobox.dataSource.fetch
    });

    combobox.dataSource.fetch();
    combobox.open();

    equal(combobox.dataSource.calls("fetch"), 1);

    $.mockjaxClear();
});



test("value('2') set selectedIndex", function() {
    var combobox = new ComboBox(input, {
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [{text: "foo", value: 1}, {text:2, value:2}]
    });
    combobox.value("2");

    equal(combobox.selectedIndex, 1);
    equal(combobox.current().index(), 1);
});

test("value method should select item if exists", function() {
    var combobox = new ComboBox(input, {
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [{text: "foo", value: 1}, {text:2, value:2}]
    });

    combobox.value("2");

    ok(combobox.ul.children().eq(1).hasClass(SELECTED));
    equal(combobox.value(), "2");
    equal(combobox.text(), "2");
    equal(combobox._old, "2");
});

test("value('') clear selection", function() {
    var combobox = new ComboBox(input, {
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [{text: "foo", value: 1}, {text:2, value:2}]
    });

    combobox.select(1);
    combobox.value("");

    ok(!combobox.ul.children().hasClass(SELECTED));
    ok(!combobox._current);
    equal(combobox.value(), "");
    equal(combobox.text(), "");
    equal(combobox._old, "");
});

test("should select jquery object", function() {
    var combobox = new ComboBox(input, {
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [{text: "foo", value: 1}, {text:2, value:2}]
    });

    combobox.select(combobox.ul.children().first());

    equal(combobox.value(), "1");
});

test("should select dom element", function() {
    var combobox = new ComboBox(input, {
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [{text: "foo", value: 1}, {text:2, value:2}]
    });

    combobox.select(combobox.ul.children().first()[0]);

    equal(combobox.value(), "1");
});

test("value method should select item with 0 value", function() {
    var combobox = new ComboBox(input, {
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [{text: "foo", value: 1}, {text:2, value:0}]
    });
    combobox.value(0);

    ok(combobox.ul.children().eq(1).hasClass(SELECTED));
    equal(combobox.value(), "0");
    equal(combobox.text(), 2);
    equal(combobox._old, 0);
});

test("select item with index -1 should clear selection", function() {
    var combobox = new ComboBox(input, {
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [{text: "foo", value: 1}, {text:2, value:2}]
    });

    combobox.select(0);

    combobox.select(-1);

    equal(combobox.value(), "");
    equal(combobox.text(), "");
});

test("select should select item by predicate", function() {
    var combobox = new ComboBox(input, {
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [{text: "foo", value: 1}, {text:2, value:2}]
    });

    combobox.select(0);
    combobox.select(function(item) {
        return item.text == 2;
    });

    ok(combobox.ul.children().eq(1).hasClass(SELECTED));
    equal(combobox.value(), "2");
    equal(combobox.text(), "2");
});

test("select(li) set selectedIndex", function() {
    var combobox = new ComboBox(input, {
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [{text: "foo", value: 1}, {text:2, value:2}]
    });

    combobox.select(1);

    equal(combobox.selectedIndex, 1);
    equal(combobox.current().index(), 1);
});

test("select() returns selectedIndex", function() {
    var combobox = new ComboBox(input, {
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [{text: "foo", value: 1}, {text:2, value:2}]
    });

    combobox.select(1);

    equal(combobox.select(), 1);
});

test("select method does not trigger change event", 0, function() {
    var combobox = new ComboBox(input, {
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [{text: "foo", value: 1}, {text:2, value:2}]
    });

    combobox.bind("change", function() {
        ok(false);
    });

    combobox.select(1);
    combobox._change();
});

test("open should open popup", 1,  function () {
    var combobox = new ComboBox(input, {
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [{text: "foo", value: 1}, {text:2, value:2}]
    });

    combobox.popup.bind("open", function(){
        ok(true);
    });

    combobox.open();
});

test("open should bind and open after this if no items", 1, function () {
    var combobox = input.kendoComboBox({
        autoBind: false,
        dataTextField: "text",
        dataValueField: "value",
        dataSource: data
    }).data("kendoComboBox");

    combobox.popup.bind("open", function(){
        ok(true);
    });

    combobox.open();
});

test("close should close popup", 1, function () {
    var combobox = new ComboBox(input, {
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [{text: "foo", value: 1}, {text:2, value:2}]
    });

    combobox.popup.bind("close", function(){
        ok(true);
    });

    combobox.open();
    combobox.close();
});

test("value should select custom option if element is select", function() {
    select = $("<select><option value=1>foo1</option><option value=3>foo3</option></select>");

    var combobox = new ComboBox(select, {
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [{text: "foo"}, {text: "bar"}]
    });

    combobox.value("custom value");

    equal(select.val(), "custom value");
    equal(combobox._old, "custom value");
});

test("text method should select item if exists", function() {
    var combobox = new ComboBox(input, {
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [{text: "foo", value: 1}, {text:2, value:2}]
    });

    combobox.text("foo");

    ok(combobox.ul.children().eq(0).hasClass(SELECTED));
    equal(combobox.value(), "1");
    equal(combobox.text(), "foo");
});

test("text should set custom value", function() {
    var combobox = new ComboBox(input, {
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [{text: "foo", value: 1}, {text:2, value:2}]
    });

    combobox.select(1);
    combobox.text("custom");

    ok(!combobox.ul.children().hasClass(SELECTED));
    ok(!combobox._current);
    ok(!combobox._selected);
    equal(combobox.value(), "custom");
    equal(combobox.text(), "custom");
});

test("text method selects item depending on ignoreCase option", function() {
    var combobox = new ComboBox(input, {
        dataSource: ["foo", "Foo"],
        ignoreCase: false
    });

    combobox.text("Foo");

    equal(combobox.selectedIndex, 1);
});

test("text method does not throw expection if set to null", function() {
    var combobox = new ComboBox(input, {
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [{text: "foo", value: 1}, {text:2, value:2}]
    });

    combobox.text(null);

    equal(combobox.value(), "");
    equal(combobox.text(), "");
});

test("text method does not throw expection if current selected item's value is null", function() {
    var combobox = new ComboBox(input, {
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [{text: "foo", value: null}]
    });

    combobox.select(0);

    combobox.text("foo");

    equal(combobox.value(), "");
    equal(combobox.text(), "foo");
});

test("text should not change selection if selected item is equal to input.value", 2, function() {
    var combobox = input.kendoComboBox({
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [
            { text: "Text1", value: 1},
            { text: "Text2", value: 2},
            { text: "Text1", value: 3}
        ]
    }).data("kendoComboBox");

    combobox.select(2);
    combobox.input.focus().blur();

    equal(combobox.text(), "Text1");
    equal(combobox.value(), 3);
});

test("text should set empty text to the combobox", function() {
    var combobox = new ComboBox(input, {
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [{text: "foo", value: 1}, {text:2, value:2}]
    });

    combobox.select(0);
    combobox.text("");

    equal(combobox.value(), "");
    equal(combobox.text(), "");
})

test('enable(false) should disable combobox', function() {
    var combobox = new ComboBox(input);

    combobox.enable(false);

    ok(combobox._inputWrapper.hasClass('k-state-disabled'));
    ok(combobox.input.attr("disabled"));
    ok(combobox.element.attr("disabled"));
});

test('after enable(false) should not open popup', function() {
    var combobox = new ComboBox(input, {
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [{text: "foo", value: 1}, {text:2, value:2}]
    });

    var oldOpen = combobox.popup.toggle,
        called = false;

    combobox.popup.toggle = function() {called = true};

    combobox.enable(false);

    combobox._arrow.click();

    ok(!called);

    combobox.popup.toggle = oldOpen;
});

test("enable(true) removes k-state-disabled class", function() {
    var combobox = new ComboBox(input);
    combobox.wrapper.addClass('k-state-disabled');
    combobox.element.attr("disabled", true);
    combobox.input.attr("disabled");

    combobox.enable();

    ok(!combobox._inputWrapper.hasClass('k-state-disabled'));
    ok(!combobox.element.attr("disabled"));
    ok(!combobox.input.attr("disabled"));
});

test("readonly() makes  input element readonly", function() {
    var combobox = input.kendoComboBox().data("kendoComboBox");

    combobox.readonly();

    equal(combobox.element.attr("readonly"), "readonly");
    equal(combobox.input.attr("readonly"), "readonly");
});

test("readonly() unbinds icon click", function() {
    var combobox = input.kendoComboBox().data("kendoComboBox");

    combobox.readonly();

    stub(combobox, {toggle: combobox.toggle});

    combobox._arrow.click();

    ok(!combobox.popup.visible());
});

test("readonly(false) removes readonly attribute", function() {
    var combobox = input.kendoComboBox().data("kendoComboBox");

    combobox.readonly();
    combobox.readonly(false);

    equal(combobox.element.attr("readonly"), undefined);
    equal(combobox.input.attr("readonly"), undefined);
});

test("readonly() removes disabled attribute and disabled class", function() {
    var combobox = input.kendoComboBox().data("kendoComboBox");

    combobox.enable(false);
    combobox.readonly();

    equal(combobox.element.attr("readonly"), "readonly");
    equal(combobox.element.attr("disabled"), undefined);
    equal(combobox.input.attr("readonly"), "readonly");
    equal(combobox.input.attr("disabled"), undefined);
    ok(combobox._inputWrapper.hasClass("k-state-default"));
    ok(!combobox._inputWrapper.hasClass("k-state-disabled"));
});

test("enable(false) removes readonly attribute and default class", function() {
    var combobox = input.kendoComboBox().data("kendoComboBox");

    combobox.readonly();
    combobox.enable(false);

    equal(combobox.element.attr("readonly"), undefined);
    equal(combobox.element.attr("disabled"), "disabled");
    equal(combobox.input.attr("readonly"), undefined);
    equal(combobox.input.attr("disabled"), "disabled");
    ok(!combobox._inputWrapper.hasClass("k-state-default"));
    ok(combobox._inputWrapper.hasClass("k-state-disabled"));
});

test("enable() enables widget after readonly()", function() {
    var combobox = input.kendoComboBox().data("kendoComboBox");

    combobox.readonly();
    combobox.enable();

    equal(combobox.input.attr("readonly"), undefined);
    equal(combobox.input.attr("disabled"), undefined);
    equal(combobox.element.attr("readonly"), undefined);
    equal(combobox.element.attr("disabled"), undefined);
    ok(combobox._inputWrapper.hasClass("k-state-default"));
    ok(!combobox._inputWrapper.hasClass("k-state-disabled"));
});

test("dataItem() returns null if no item is selected", function() {
    var combobox = new ComboBox(input, {
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [{text: "foo", value: 1}, {text:2, value:2}]
    });

    equal(combobox.selectedIndex, -1);
    equal(combobox.dataItem(), null);
});

test("dataItem() returns dataItem of the selected LI element", function() {
    var combobox = new ComboBox(input, {
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [{text: "foo", value: 1}, {text:2, value:2}]
    });

    combobox.select(1);
    equal(combobox.selectedIndex, 1);
    equal(combobox.dataItem(), combobox.dataSource.view()[1]);
});

test("dataItem() returns dataItem depending on passed index", function() {
    var combobox = new ComboBox(input, {
        dataTextField: "text",
        dataValueField: "value",
        dataSource: [{text: "foo", value: 1}, {text:2, value:2}]
    });

    equal(combobox.dataItem(1), combobox.dataSource.view()[1]);
});

test("value(value) calls dataSource.fetch if no data", function() {
    var combobox = new ComboBox(input, {
        autoBind: false
    });

    stub(combobox.dataSource, {
        fetch: combobox.dataSource.fetch
    });

    combobox.value("1");

    equal(combobox.dataSource.calls("fetch"), 1);
});

test("value method with 0 argument calls dataSource.fetch if no data", function() {
    var combobox = new ComboBox(input, {
        autoBind: false
    });

    stub(combobox.dataSource, {
        fetch: combobox.dataSource.fetch
    });

    combobox.value(0);

    equal(combobox.dataSource.calls("fetch"), 1);
});

test("value(value) does not initiate second Ajax request", function() {
    $.mockjaxSettings.responseTime = 1000; //TODO: set it to 0
    $.mockjaxSettings.contentType = "text/html";
    $.mockjax({ url: "fake.json", responseText: [] });

    var combobox = new ComboBox(input, {
        autoBind: false,
        dataSource: {
            transport: {
                read: { url: "fake.json", dataType: "json" }
            }
        }
    });

    stub(combobox.dataSource, {
        fetch: combobox.dataSource.fetch
    });

    combobox.dataSource.fetch();
    combobox.value("1");

    equal(combobox.dataSource.calls("fetch"), 1);

    $.mockjaxClear();
});

test("value('') clears selection and do not fetch", function() {
    var combobox = new ComboBox(input);

    stub(combobox.dataSource, {
        fetch: combobox.dataSource.fetch
    });

    combobox.value("");

    equal(combobox.selectedIndex, -1);
    equal(combobox.dataSource.calls("fetch"), 0);
});

test("ComboBox does not select correct item after filter() and value()", function() {
    var combobox = new ComboBox(input, {
        dataSource: ["Item1", "Item2"],
        filter: "contains"
    });

    combobox.search("item1");
    combobox.close();

    combobox.value("item1");

    combobox.open();

    ok(combobox.ul.children(":first").hasClass("k-state-selected"));
});

asyncTest("ComboBox filter after value method is used", 1, function() {
    var combobox = new ComboBox(input, {
        dataSource: ["Item1", "Item2"],
        filter: "contains",
        delay: 0
    });

    stub(combobox, {
        search: combobox.search
    });

    //simulate search
    combobox._prev = "i";
    combobox.value("");

    combobox.input.val("i");
    combobox._search();

    setTimeout(function() {
        start();
        equal(combobox.calls("search"), 1);
    });
});

test("ComboBox does not change text if custom value is equal to options.value", function() {
    var combobox = new ComboBox(input, {
        dataSource: ["Item1", "Item2"],
        filter: "contains",
        autoBind: false,
        value: "value",
        text: "text"
    });

    combobox.value("value");

    equal(combobox.value(), "value");
    equal(combobox.text(), "text");
});

test("suggest method outputs word parameter", function() {
    var combobox = new ComboBox(input, {
        dataSource: ["Item1", "Item2"]
    });

    combobox.input.focus();
    combobox.suggest("item1");

    equal(combobox.text(), "item1");
});

test("suggest method accepts a jQuery element", function() {
    var combobox = new ComboBox(input, {
        dataSource: ["Item1", "Item2"]
    });

    combobox.suggest(combobox.ul.children(":last"));

    equal(combobox.text(), "Item2");
});

test("suggest method accepts a data item", function() {
    var combobox = new ComboBox(input, {
        dataValueField: "text",
        dataTextField: "text",
        dataSource: [{
            text: "Item1"
        }, {
            text: "Item2"
        }]
    });

    combobox.suggest(combobox.dataSource.data()[1]);

    equal(combobox.text(), "Item2");
});
})();
