layui.define([], function(exports) {
    var layrouter = {
        // 路由表
        routes: [],
        // 当前 hash
        currentHash: '',
        // 注册路由
        register: function(hash, callback) {
            var that = this;
            // 给不同的 hash 设置不同的回调函数
            that.routes[hash] = callback || function() {};
        },
        // 刷新
        refresh: function() {
            var that = this;
            // 获取相应的 hash 值
            console.log(location.hash);
            console.log(location.hash.slice(1));
            // 如果存在 hash 则获取, 否则为 /
            that.currentHash = location.hash.slice(1) || '/';
            if (that.currentHash && this.currentHash != '/') {
                // 根据当前 hash 调用对应的回调函数
                that.routes[that.currentHash]();
            }
        },
        // 初始化
        init: function() {
            var that = this;
            window.addEventListener('load', that.refresh.bind(that), false);
            window.addEventListener('hashchange', that.refresh.bind(that), false);
        },
        // Removes the current page from the session history and navigates to the given URL.
        replace: function(url) {
            window.location.replace(url);
        },
        // Navigate to the given URL.
        href: function(url) {
            window.location.href = url;
        },
        // Reloads the current page.
        reload: function() {
            window.location.reload();
        }
    };
    exports('layrouter', layrouter);
});