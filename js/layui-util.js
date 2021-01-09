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
        },choose: function(obj){
            var files = obj.pushFile();
            //预读本地文件，如果是多文件，则会遍历。(不支持ie8/9)
            obj.preview(function(index, file, result){
                $('#'+name+"_img").attr('src',result);
            });
        }
    });
}