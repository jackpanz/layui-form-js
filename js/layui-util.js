function setLayuiOnTool(name) {
    layui.table.on('tool(' + name + ')', function (obj) {
        var fun = eval(obj.event);
        if (typeof fun === "function") {
            fun(obj.data);
        }
    });
}

function templateAnalysis(template, data) {
    var regular = /{{(.*?)}}/g;
    var template_cp = template
    while (match = regular.exec(template)) {
        var fullName = match[0];
        var name = match[1];
        var value = null;
        if ($.trim(name) === "") {
            return null;
        }
        try {
            value = eval(name);
        } catch (e) {
        }
        if (typeof (value) === "undefined" || value == null) {
            return null;
        }
        console.info("url replace:fullName=" + fullName + " value=" + value);
        template_cp = template_cp.replace(fullName, value);
    }
    return template_cp;
}

function tmd(args, data, queueName) {
    var url = null;
    if (typeof args == "string") {
        var regular = /{{(.*?)}}/g;
        url = args;
        if (regular.test(url)) {
            url = templateAnalysis(url, data);
        }
    } else if (typeof args == "function") {
        try {
            url = args.apply(null, data);
        } catch (e) {
        }
    }

    url = url.indexOf("?") === -1 ? url + "?times=" + new Date().getTime() : url + "&times=" + new Date().getTime();

    //console.info("url:"+ url);
    if (url && url != "") {
        $.ajax({
            url: url,
            method: 'GET',
            dataType: 'json',
            success: function (result) {
                data.push(result.data || result.rows);
                $(document).dequeue(queueName);
            },
            error: function () {
                data.push(null);
                $(document).dequeue(queueName);
            }
        });
    } else {
        data.push(null);
        $(document).dequeue(queueName);
    }
}

$.ajaxObject = function () {
    var queueName = "queue" + guid();
    var data = Array();
    var callback = arguments[arguments.length - 1];
    for (var i = 0; i < arguments.length - 1; i++) {
        $(document).queue(queueName, tmd.bind(this, arguments[i], data, queueName));
    }
    $(document).queue(queueName, function () {
        callback.apply(null, data);
    });
    $(document).dequeue(queueName);
};

function setCheckboxValue(entity, content) {
    $.each(entity, function (name, attr) {
        if(content === attr){
            $.each(content, function (jname, jattr) {
                entity[name+'.' + jname ] = jattr;
            });
            return false;
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
    html += '<button id="ff-search" class="layui-btn layuiadmin-btn-list" lay-submit lay-filter="' + form.id + '-submit">'
    html += '<i class="layui-icon layui-icon-search layuiadmin-button-btn"></i>'
    html += '</button>'
    html += '</div>'

    html += '</div>'
    $(form).append(html);

}

$.fn.layuiForm = function (options) {
    var form = this.get(0);
    if (!form) {
        return;
    }
    if (typeof (options) == "undefined") {
        return $.data(form, "layuiForm");
    } else {
        return new layuiForm(form, options);
    }
};

$.ajaxForm = function (options) {
    layui.form.on('submit(' + options.layFilter + ')', function(params){
        options = jQuery.extend({}, {
            type:'post',
            dataType:"json",
            data:params.field,
            success: $.ajaxForm.defSuccess(),
            error:function(e){
                layer.alert("提交失敗！")
            },
        }, options);
        $.ajax(options);
        return false;
    });
}

$.ajaxForm.defSuccess = function() {
    return function(data) {
        if(data.action){
            layer.msg('OK', {
                offset: '15px'
                ,icon: 1
                ,time: 1000
            });
        }
        else{
            layer.alert(data.msg)
        }
    }
}

var singleTitleTemp =
'    <div class="layui-form-item">'+
'        <label class="layui-form-label">{{ d.el.title }}</label>'+
'            {{# layui.each(d.els, function(index, item){ }}'+
'            {{#  if(item.type === "uloadImg" ){  }}'+
'            <div style="display: none" class="layui-input-block">'+
'               <a href=""><img id="{{ item.id + "_img" }}" style="height: 100px" src="" /></a>'+
'            </div>'+
'            {{# } }}'+
'            <div class="{{ item.inputClass }}" style="{{ item.widthTxt }}">'+
'                {{ item.html }}'+
'            </div>'+
'            {{#  if(item.button1){  }}'+
'            <div class="{{ item.inputClass }}" >'+
'                <button type="button" id="{{ item.id }}_button1" class="layui-btn layui-btn-sm" style="margin-top: 3px" >{{ item.button1 }}</button>'+
'            </div>'+
'            {{# } }}'+
'            {{# });  }}'+
'    </div>';

var multipleTitleTemp =
'    <div class="layui-form-item">'+
'        {{# layui.each(d.els, function(index, item){     }}'+
'        <div class="layui-inline" >'+
'            <label class="layui-form-label">{{ item.title }}</label>'+
'            <div class="{{ item.inputClass }}" >'+
'                {{ item.html }}'+
'            </div>'+
'            {{#  if(item.button1){  }}'+
'            <div class="layui-input-inline" style="width: auto;" >'+
'                <button type="button" id="{{ item.id }}_button1" class="layui-btn layui-btn-sm" style="margin-top: 6px" >{{ item.button1 }}</button>'+
'            </div>'+
'            {{# } }}'+
'        </div>'+
'        {{# });  }}'+
'    </div>';

function layuiForm(form, option) {

    var defaults = {
        before: null
    };

    $.data(form, "layuiForm", this);
    this.option = jQuery.extend({}, defaults, option);
    this.jform = $(form);

    this.initElement = function(el){
        el = jQuery.extend({}, {
            id: el.id || el.name,
            placeholderText: ' placeholder=' + (el.placeholder || el.title) + ' ',
            verifyText: el.verify ? ' lay-verify="' + el.verify + '" ' : "",
            verTypeText: el.verType ? ' lay-verType="' + el.verType + '" ' : 'lay-verType="tips"',
            disabledText: el.disabled ? ' disabled="' + el.disabled + '" ' : "",
            nameText: el.name ? ' name="' + el.name + '" ' : "",
            idText: ' id="' + (el.id || el.name) + '" ',
            titleKey: 'title',
            valueKey: 'value',
            nameKey: 'name',
            widthTxt: el.width ? 'width:' + el.width : '',
            template:singleTitleTemp,
            inputClass:  ['uploadImg','radio','checkbox','textarea'].includes(el.type) ? 'layui-input-block' : 'layui-input-inline'
        }, el);

        if (typeof (el.height) !== "undefined" && el.height != null) {
            el.heightText = "height:" + el.height + "px";
        } else {
            el.heightText = "";
        }

        el.styleText = el.heightText;
        el.attributeText = el.idText + el.nameText + el.placeholderText + el.verifyText + el.verTypeText + el.disabledText;
        return el;
    }


    this.renderAll = function () {
        for (var i = 0; i < this.option.els.length; i++) {
            var el = this.option.els[i];
            if(Array !== el.constructor ){
                if( el.type === 'hidden' || el.type === 'templet' ){
                    el = this.initElement(el);
                    var html = this.elementType[el.type].getHtml(el);
                    this.append(html);
                    continue;
                } else {
                    this.renderTemplate(new Array(el))
                }
            } else {
                this.renderTemplate(el);
            }
        }
    };

    this.renderTemplate = function (els) {
        for (var j = 0; j < els.length; j++) {
            var subEl = els[j];
            subEl = this.initElement(subEl);
            subEl.html = this.elementType[subEl.type].getHtml(subEl);
            els[j] = subEl;
        }
        layui.laytpl(els[0].template).render({el:els[0],els:els}, function (html) {
            this.append(html);
        }.bind(this));
    };

    this.append = function (html) {
        if (this.option.before != null) {
            $(this.option.before).before(html);
        } else {
            this.jform.append(html);
        }
    }

    var _text = function () {
        this.getHtml = function (el) {
            return '<input type="text" class="layui-input" ' + el.attributeText + ' style="' + el.styleText + '" >';
        };
    }

    var _password = function () {
        this.getHtml = function (el) {
            return '<input type="password" autocomplete="off" class="layui-input" ' + el.attributeText + ' style="' + el.styleText + '">';
        };
    }

    var _textarea = function () {
        this.getHtml = function (el) {
            return '<textarea class="layui-textarea" ' + el.attributeText + ' style="' + el.styleText + '"></textarea>';
        };
    }

    var _hidden = function () {
        this.getHtml = function (el) {
            var html = '<input ' + el.idText + el.nameText + ' type="hidden" />';
            return html;
        };
    }

    var _select = function () {
        this.getHtml = function (el) {

            var options = "";
            $.each(el.rows, function (i, row) {
                options += '<option value="' + row[el.valueKey] + '">' + row[el.titleKey] + '</option>';
            })

            var html = '<select ' + el.attributeText + ' style="' + el.styleText + '" >'
                + options
                + '</select>';

            return html;

        }
    }

    var _radio = function () {
        this.getHtml = function (el) {
            var radio = "";
            $.each(el.rows, function (i, row) {
                var input = $('<input />', {
                    name: el.id
                    ,title: row[el.titleKey]
                    ,type:'radio'
                    ,value: row[el.valueKey]
                    ,checked: (!!row.checked)
                    ,'lay-filter':el.id
                });
                radio += input.prop("outerHTML");
            });
            return radio;
        }
    }

    var _checkbox = function () {
        this.getHtml = function (el) {

            var checkboxs = "";
            $.each(el.rows, function (i, row) {

                var input = $('<input />', {
                    //id: row[el.nameKey]
                    name: el.name
                    ,title: row[el.titleKey]
                    ,checked: (!!row.checked)
                    ,"lay-filter":el.name
                    ,type:'checkbox'
                    , value: typeof (row[el.valueKey]) === "undefined" ? null : row[el.valueKey]
                });

                checkboxs += input.prop("outerHTML");
                    // + '<div class="layui-unselect layui-form-checkbox">'
                    // + '<span>' + row[el.titleKey] + '</span>'
                    // + '<i class="layui-icon layui-icon-ok"></i>'
                    // + '</div>';
            })

            // var html =
            //     '<div class="layui-form-item">'
            //     + '<label class="layui-form-label">' + el.title + '</label>'
            //     + '<div class="layui-input-block">'
            //     + checkboxs
            //     + '</div>'
            //     + '</div>';

            return checkboxs;

        }
    }

    var _uploadImg = function () {
        this.getHtml = function (el) {
            var html =
            '<button id="'+el.id+'" type="button" class="layui-btn">'
            +'<i class="layui-icon">&#xe67c;</i>上传图片'
            +'</button>';
            return html;
        }
    }

    var _templet = function () {
        this.getHtml = function (el) {
            if( el.render ){
                return el.render();
            } else if(el.templet) {
                return layui.laytpl($(el.templet).html()).render(el.d?el.d:{})
            }
        }
    }

    this.elementType = {
        "text": new _text(),
        "textarea": new _textarea(),
        "hidden": new _hidden(),
        "password": new _password(),
        "select": new _select(),
        "checkbox": new _checkbox(),
        "radio": new _radio(),
        "uploadImg": new _uploadImg(),
        "templet": new _templet(),
        // "lable": new _lable()
    };

    this.renderAll();
    return this;

}

function renderFile(name){
    layui.upload.render({
        elem: '#' + name
        , url: '/'
        , accept: 'file'
        , auto: false
        , field: name
        // , bindAction: '#upfile' //关闭的上传按钮   html中此id所在元素也被注释
        , multiple: true
        , done: function (res) {
            alert("上传成功");
        }
    });
}