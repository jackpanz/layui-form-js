layui.define(['form','upload','laydate','laytpl'],function (exports) {

    var _jquery = layui.jquery;

    var formjs = {
        elementType:{
            "text": new _text(),
            "textarea": new _textarea(),
            "hidden": new _hidden(),
            "password": new _password(),
            "select": new _select(),
            "checkbox": new _checkbox(),
            "radio": new _radio(),
            "uploadImg": new _uploadImg(),
            "templet": new _templet(),
        },
        render:function (option) {
            var defaults = {
                before: null
            };
            option = _jquery.extend({},defaults,option);
            this.renderAll(option);
        },
        append:function (html,option) {
            if (option.before != null) {
                layui.$(option.before).before(html);
            } else {
                layui.$(option.ff).append(html);
            }
        },
        renderAll:function (option) {
            for (var i = 0; i < option.els.length; i++) {
                var el = option.els[i];
                if(Array !== el.constructor ){
                    // if( el.type === 'custom' ){
                    //     el = this.initElement(el);
                    //     this.append(el.custom.getHtml(el),option);
                    //     continue;
                    // } else if( el.type === 'hidden' || el.type === 'templet'){
                    if( el.type === 'hidden' || el.type === 'templet'){
                        el = this.initElement(el);
                        var html = this.elementType[el.type].getHtml(el);
                        this.append(html,option);
                        continue;
                    } else {
                        var html = this.getTemplateHtml(new Array(el),)
                        this.append(html,option);
                    }
                } else {
                    var html = this.getTemplateHtml(el);
                    this.append(html,option);
                }
            }
        },
        getTemplateHtml:function (els) {
            for (var j = 0; j < els.length; j++) {
                var subEl = els[j];
                subEl = this.initElement(subEl);
                subEl.html = this.elementType[subEl.type].getHtml(subEl);
                els[j] = subEl;
            }
            var template = this.elementType[subEl.type].getTemplate(subEl);
            return layui.laytpl(template).render({el:els[0],els:els});
        },
        initElement:function(el){
            el = _jquery.extend({}, {
                id: el.id || el.name,
                placeholder: el.placeholder || el.title,
                verify:null,
                verType:'tips',
                style:'',
                titleKey: 'title',
                valueKey: 'value',
                nameKey: 'name',
                readonly: false,
                disabled: false,
                inputClass:  ['uploadImg','radio','checkbox','textarea'].indexOf(el.type) > -1 ? 'layui-input-block' : 'layui-input-inline'
            }, el);
            return el;
        }
    }

    exports("formjs",formjs);
});

var singleTitleTemp =
    '    <div class="layui-form-item">'+
    '        <label class="layui-form-label">{{ d.el.title }}</label>'+
    '            {{# layui.each(d.els, function(index, item){ }}'+
    '            <div class="{{ item.inputClass }}" >'+
    '                {{ item.html }}'+
    '            </div>'+
    '            {{#  if(item.button1){  }}'+
    '            <div class="{{ item.inputClass }}" >'+
    '                <button type="button" id="{{ item.id }}_button1" class="layui-btn layui-btn-sm" style="margin-top: 3px" >{{ item.button1 }}</button>'+
    '            </div>'+
    '            {{# } }}'+
    '            {{# });  }}'+
    '    </div>';

var _text = function () {
    this.getHtml = function (el) {
        var tag = layui.jquery('<input />', {
            type:'text'
            ,class:'layui-input'
            ,id:el.id
            ,name: el.name
            ,value: el.value
            ,placeholder: el.placeholder
            ,readonly:el.readonly
            ,disabled:el.disabled
            ,style:el.style
            ,'lay-verify':el.verify
            ,'lay-verType':el.verType
        });
        return tag.prop("outerHTML");
    };
    this.getTemplate = function (el) {
        return singleTitleTemp;
    }
}

var _password = function () {
    this.getHtml = function (el) {
        var tag = layui.jquery('<input />', {
            type:'password'
            ,class:'layui-input'
            ,id:el.id
            ,name: el.name
            ,value: el.value
            ,placeholder: el.placeholder
            ,readonly:el.readonly
            ,disabled:el.disabled
            ,style:el.style
            ,autocomplete: "off"
            ,'lay-verify':el.verify
            ,'lay-verType':el.verType
        });
        return tag.prop("outerHTML");
    };
    this.getTemplate = function (el) {
        return singleTitleTemp;
    }
}

var _textarea = function () {
    this.getHtml = function (el) {
        var tag = layui.jquery('<textarea />', {
            type:'password'
            ,class:'layui-textarea'
            ,id:el.id
            ,name: el.name
            ,text: el.value
            ,placeholder: el.placeholder
            ,readonly:el.readonly
            ,disabled:el.disabled
            ,style:el.style
            ,'lay-verify':el.verify
            ,'lay-verType':el.verType
        });
        return tag.prop("outerHTML");
    };
    this.getTemplate = function (el) {
        return singleTitleTemp;
    }
}

var _hidden = function () {
    this.getHtml = function (el) {
        var tag = layui.jquery('<input />', {
            type:'hidden'
            ,id:el.id
            ,name: el.name
            ,value: el.value
        });
        return tag.prop("outerHTML");
    };
}

var _select = function () {
    this.getHtml = function (el) {
        var tag = layui.jquery('<select />', {
            id:el.id
            ,name: el.name
            ,disabled:el.disabled
            ,style:el.style
            ,'lay-verify':el.verify
            ,'lay-verType':el.verType
        });
        layui.jquery.each(el.rows, function (i, row) {
            var option = layui.jquery('<option/>',{
                value : row[el.valueKey]
                ,text : row[el.titleKey]
            });
            tag.append(option);
        })
        return tag.prop("outerHTML");
    }
    this.getTemplate = function (el) {
        return singleTitleTemp;
    }
}

var _radio = function () {
    this.getHtml = function (el) {
        var radio = "";
        layui.jquery.each(el.rows, function (i, row) {
            var input = layui.jquery('<input />', {
                name: el.id
                ,title: row[el.titleKey]
                ,type:'radio'
                ,value: row[el.valueKey]
                ,checked: (!!row.checked)
                ,disabled:el.disabled
                ,'lay-filter':el.id
                // ,'lay-verify':el.verify
                // ,'lay-verType':el.verType
            });
            radio += input.prop("outerHTML");
        });
        return radio;
    }
    this.getTemplate = function (el) {
        return singleTitleTemp;
    }
}

var _checkbox = function () {
    this.getHtml = function (el) {
        var checkboxs = "";
        layui.jquery.each(el.rows, function (i, row) {
            var input = layui.jquery('<input />', {
                type:'checkbox'
                ,name: el.name+'['+row[el.nameKey]+']'
                ,title: row[el.titleKey]
                ,checked: (!!row.checked)
                ,disabled:el.disabled
                ,"lay-filter":el.id
                // ,'lay-verify':el.verify
                // ,'lay-verType':el.verType
                , value: typeof (row[el.valueKey]) === "undefined" ? null : row[el.valueKey]
            });
            checkboxs += input.prop("outerHTML");
        })
        return checkboxs;
    }
    this.getTemplate = function (el) {
        return singleTitleTemp;
    }
}

var _uploadImg = function () {
    this.getHtml = function (el) {
        var upload = el.upload ? el.upload:'上传图片';
        var html =
            '<button id="'+el.id+'" type="button" class="layui-btn">'
            +'<i class="layui-icon">&#xe67c;</i>' + upload
            +'</button>';
        return html;
    }
    this.getTemplate = function (el) {
        var template =
            '    <div class="layui-form-item">'+
            '        <label class="layui-form-label">{{ d.el.title }}</label>'+
            '            {{# layui.each(d.els, function(index, item){ }}'+
            '            <div style="display: none" class="layui-input-block">'+
            '               <a href=""><img id="{{ item.id + "_img" }}" style="height: 100px" src="" /></a>'+
            '            </div>'+
            '            <div class="{{ item.inputClass }}" >'+
            '                {{ item.html }}'+
            '            </div>'+
            '            {{#  if(item.button1){  }}'+
            '            <div class="{{ item.inputClass }}" >'+
            '                <button type="button" id="{{ item.id }}_button1" class="layui-btn layui-btn-sm" style="margin-top: 3px" >{{ item.button1 }}</button>'+
            '            </div>'+
            '            {{# } }}'+
            '            {{# });  }}'+
            '    </div>';
        return template;
    }
}

var _templet = function () {
    this.getHtml = function (el) {
        return el.render(el);
    }
    this.getTemplate = function (el) {
        return singleTitleTemp;
    }
}