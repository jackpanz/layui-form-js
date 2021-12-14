# Layui-form-js
The layui form is generated by JS.
- Support layuiadmin
- Support alert form
- Support layui form validation

# Online example:
<img src="https://github.com/jackpanz/layui-form-js/blob/master/demo/1.png?raw=true"  /><br/>
- https://jack-hk-oss.oss-cn-hongkong.aliyuncs.com/layui-form-js/index.html

# Use
Download formjs.js to the layui modules directory.
use formjs module.
```js
layui.config({
        base: 'layuiadmin/'
}).extend({
        formjs: 'lib/formjs'
}).use(['formjs'], function () {

});
```

# Example
```html
<form id="ff" lay-filter="ff" class="layui-form" enctype="multipart/form-data" method="post">
        <div id="button-layout" class="layui-form-item">
            <div class="layui-input-block" >
                <button type="submit" class="layui-btn" lay-submit lay-filter="sm">提交</button>
            </div>
        </div>
</form>
```

```js
layui.config({
        base: 'layuiadmin/'
}).extend({
        formjs: 'lib/formjs'
}).use(['formjs'], function () {

        layui.formjs.render(
            {
                ff: '#ff',
                before: '#button-layout',
                els: [
                    {type: 'hidden', name: 'id'},
                    {type: 'text', name: 'title_long', title: 'Text short'},
                    {type: 'text',name: 'title_short', title: 'Text long'},
                    {type: 'password', name: 'password', title: 'password',button1:'button name'},
                    {type: 'select', name: 'select_long', title: 'Select short'},
                    {type: 'radio', name: 'radioz', title: 'radio'},
                    {type: 'checkbox', name: 'checkboxz', title: 'Checkbox', rows: cRows},
                    {type: 'textarea', name: 'textareaz', title: 'Textarea',value:'textarea textarea'}
                ]
            }
        );

        layui.form.render();

        layui.form.on('submit(sm)', function (obj) {
            alert(JSON.stringify($("#ff").serializeArray()));
            return false;
        });

});
```
# Layui form tags
- text 
- textarea 
- hidden 
- password 
- select 
- checkbox 
- radio 
- uploadImg 
- templet(customize)

