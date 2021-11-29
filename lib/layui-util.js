function renderLaytpl(id, el) {
    return layui.laytpl($('#' + id).html()).render(el);
}

function setLayuiOnTool(name) {
    layui.table.on('tool(' + name + ')', function (obj) {
        var fun = eval(obj.event);
        if (typeof fun === "function") {
            fun(obj.data, obj);
        }
    });
}

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function guid() {
    return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
}

$.fn.layuiSearch = function (options) {
    var form = this.get(0);
    if (!form) {
        return;
    }
    if (typeof (options) == "undefined") {
        return $.data(form, "layuiSearch");
    } else {
        //options.submit = sm;
        return new layuiSearch(form, options);
    }
};

function attrHTML(name, value) {
    var reg = /^\s*$/
    if (value != null && value != undefined && !reg.test(value)) {
        return ' ' + name + '="' + value + '"'
    } else {
        return "";
    }
}

function layuiSearch(form, option) {

    var html = '<div class="layui-form-item">';
    var sform = 'sform_' + $(form).attr('id');
    var sm = $(form).attr('id') + '-submit';

    $.each(option.els, function (i, el) {
        el = jQuery.extend({}, {
            id: el.id || el.name,
            titleKey: 'title',
            valueKey: 'value',
            value: null,
            placeholder: el.placeholder || el.title || null
        }, el);

        el = jQuery.extend({}, {
            placeholderText: attrHTML('placeholder', el.placeholder),
            idText: attrHTML('id', el.id),
            nameText: attrHTML('name', el.name),
            valueText: attrHTML('value', el.value),
        }, el);

        if (el.type === 'text') {
            el.attributeText = el.idText + el.nameText + el.placeholderText + el.valueText;
        } else {
            el.attributeText = el.idText + el.nameText;
        }

        if (el.type === 'hidden') {
            html += '<input ' + el.attributeText + ' type="hidden" />'
        } else if (el.type === 'text') {
            html += '<div class="layui-inline">'
            html += '<label class="layui-form-label">' + el.title + '</label>'
            html += '<div class="layui-input-inline">'
            html += '<input type="text" ' + el.attributeText + ' autocomplete="off" class="layui-input">'
            html += '</div>'
            html += '</div>'
        } else if (el.type === 'select') {
            html += '<div class="layui-inline">'
            html += '<label class="layui-form-label">' + el.title + '</label>'
            html += '<div class="layui-input-inline">'
            html += '<select ' + el.attributeText + '>'
            $.each(el.rows, function (i, opt) {
                if (el.value === opt[el.valueKey]) {
                    html += '<option selected value="' + opt[el.valueKey] + '">' + opt[el.titleKey] + '</option>';
                } else {
                    html += '<option value="' + opt[el.valueKey] + '">' + opt[el.titleKey] + '</option>';
                }
            })
            html += '</select>'
            html += '</div>'
            html += '</div>'
        }

    })

    //submit
    html += '<div class="layui-inline">'
    html += '<button id="ff-search" class="layui-btn layuiadmin-btn-list" lay-submit lay-filter="' + sm + '">'
    html += '<i class="layui-icon layui-icon-search layuiadmin-button-btn"></i>'
    html += '</button>'
    html += '</div>'

    html += '</div>'


    $(form).attr('lay-filter', sform);
    $(form).append(html);
    layui.form.render(null, sform);
    layui.form.on('submit(' + sm + ')', option.submit);

}

/**
 *
 * $.layuiAF({
 *     ff:"ff"
 *     ,ur:"url"
 *     ,success:success
 * })
 *
 */
$.layuiAF = function (options) {
    layui.form.on(`submit(${options.ff})`, function (obj) {
        var defOption = jQuery.extend({}, {
            success: $.layuiAF.defSuccess
            ,error: $.layuiAF.defError
            ,type: 'post'
            ,dataType: "json"
            ,data: obj.field
        }, options);
        $.ajax(defOption);
        return false;
    });
};

$.layuiAF.defSuccess = function (data) {
    if (data.action) {
        msgD('OK');
    } else {
        alertE(data.msg);
    }
}

$.layuiAF.defError = function (e) {
    console.log(e);
    alertE("提交失敗！")
}

function closePage() {
    layer.closeAll('page');
}

function showLoading() {
    layer.load(1, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
    });
}

function dismissLoading() {
    layer.closeAll('loading');
}

function alertE(msg) {
    layer.alert(msg, {icon: 2})
}

function alertD(msg) {
    layer.alert(msg, {icon: 0})
}

function setCheckboxByObject(name, obj) {
    for (var subName in obj) {
        var value = obj[subName];
        if ( value ) {
            var layFilter = `${name}.${subName}`;
            var jqObject = $(`input[type="checkbox"][name="${layFilter}"]`);
            if (jqObject.length > 0) {
                jqObject.prop("checked",true);
            }
        }
    }
}

function setCheckboxByArray(name, arr) {
    for(var index in arr){
        var value = arr[index];
        var jqObject = $(`input[type="checkbox"][name="${name}"]`);
        $(jqObject).each(function(index,element){
            if( $(this).val() === String(value) ){
                $(this).prop("checked",true);
            }
        });
    }
}

function setTypesValueByArguments(start, arguments, types) {
    for (var i = start; i < arguments.length; i++) {
        for (attr in types) {
            if (attr.toString() === typeof arguments[i]) {
                types[attr] = arguments[i];
            }
        }
    }
}

function confirmD(msg, fun1) {
    layer.confirm('確定刪除嗎？', {icon: 3, title: '提示'}, fun1);
}

function msgD() {
    var msg = arguments[0];
    var types = {
        'string': null,
        'number': 1000,
        'function': null
    }
    setTypesValueByArguments(1, arguments, types);

    layer.msg(msg, {
        offset: '15px'
        , icon: 1
        , time: types['number']
    }, function () {
        if (types['function'] !== null) {
            types['function']();
        } else if (isNotBlank(types['string'])) {
            location.href = types['string']; //後臺主頁
        }
    });

}

function rule_password(value) {
    var regex = /(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[\W])(?=.*[\S])^[0-9A-Za-z\S]{6,12}$/g;
    if (!regex.test(value)) {
        return "密碼长度为8位或以上，並包括數字、大寫字母、小寫字母以及特殊字符";
    }
}

function rule_repassword(value) {
    if (value !== $("#password").val())
        return "新密碼和確認密碼不一樣"
}

function rule_username(value) {
    var regex = /^[a-zA-Z]([-_a-zA-Z0-9]{4,20})$/;
    if (!regex.test(value)) {
        return "必须以字母开头，英文、数字";
    }
}