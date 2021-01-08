/**

 @Name：layuiAdmin iframe版主入口
 @Author：贤心
 @Site：http://www.layui.com/admin/
 @License：LPPL

 */

layui.extend({
    setter: 'config' //配置模块
    ,admin: 'lib/admin' //核心模块
    ,view: 'lib/view' //视图渲染模块
}).define(['setter', 'admin'], function(exports){
    var setter = layui.setter
        ,element = layui.element
        ,admin = layui.admin
        ,tabsPage = admin.tabsPage
        ,view = layui.view

        //打开标签页
        ,openTabsPage = function(url, text){
            //遍历页签选项卡
            var matchTo
                ,tabs = $('#LAY_app_tabsheader>li')
                ,path = url.replace(/(^http(s*):)|(\?[\s\S]*$)/g, '');

            tabs.each(function(index){
                var li = $(this)
                    ,layid = li.attr('lay-id');

                if(layid === url){
                    matchTo = true;
                    tabsPage.index = index;
                }
            });

            text = text || '新标签页';

            //定位当前tabs
            var setThisTab = function(){
                element.tabChange(FILTER_TAB_TBAS, url);
                admin.tabsBodyChange(tabsPage.index, {
                    url: url
                    ,text: text
                });
            };

            if(setter.pageTabs){
                //如果未在选项卡中匹配到，则追加选项卡
                if(!matchTo){
                    //延迟修复 Firefox 空白问题
                    setTimeout(function(){
                        $(APP_BODY).append([
                            '<div class="layadmin-tabsbody-item layui-show">'
                            ,'<iframe id="iframe-' +  tabsPage.index + '" src="'+ url +'" frameborder="0" class="layadmin-iframe"></iframe>'
                            ,'</div>'
                        ].join(''));
                        setThisTab();
                    }, 10);

                    tabsPage.index = tabs.length;
                    element.tabAdd(FILTER_TAB_TBAS, {
                        title: '<span>'+ text +'</span>'
                        ,id: url
                        ,attr: path
                    });

                } else {
                    if( tabsPage.index > 0 ){
                        var iframe = document.getElementById("iframe-" + tabsPage.index);
                        var src = document.location.protocol + "//" + window.location.host + url;
                        // console.log("url:"+url)
                        // console.log("iframe.src:"+iframe.src)
                        // console.log("iframe.href:"+iframe.contentWindow.location.href)
                        // console.log("src:"+src)
                        if( src !== iframe.contentWindow.location.href.toString() ){
                            console.log("iframe-" + tabsPage.index + " 重置URL")
                            iframe.src = src;
                        }
                    }
                }
            } else {
                var iframe = admin.tabsBody(admin.tabsPage.index).find('.layadmin-iframe');
                iframe[0].contentWindow.location.href = url;
            }

            setThisTab();

        }

        ,APP_BODY = '#LAY_app_body', FILTER_TAB_TBAS = 'layadmin-layout-tabs'
        ,$ = layui.$, $win = $(window);

    //初始
    if(admin.screen() < 2) admin.sideFlexible();

    //将模块根路径设置为 controller 目录
    layui.config({
        base: setter.base + 'modules/'
    });

    //扩展 lib 目录下的其它模块
    layui.each(setter.extend, function(index, item){
        var mods = {};
        mods[item] = '{/}' + setter.base + 'lib/extend/' + item;
        layui.extend(mods);
    });

    view().autoRender();

    //加载公共模块
    layui.use('common');

    //对外输出
    exports('index', {
        openTabsPage: openTabsPage
    });
});
