{
    let view = {
        el: '.newSongFrom',
        template: `
        <h1>新建歌曲</h1>
        <form action="">
            <div class="row">
                <label for="">歌名:</label>
                    <input name="name" type="text" value="__name__">
                
            </div>
            <div class="row">
                <label for="">歌手:
                    <input name="singer" type="text" value="__singer__">
                </label>
            </div>
            <div class="row">
                <label for="">外链:
                    <input name="url" type="text" value="__url__">
                </label>
            </div>
            <div class="row">
                <label for="">图片:
                    <input name="img" type="text" value="__img__">
                </label>
            </div>
            
            <div class="row">
                <label for="">歌词:
                    <textarea name="lrc">__lrc__</textarea>
                </label>
            </div>
            <div class="row">
                <button type="submit">保存</button>
            </div>
            </form>
            <div class="upArea">
                <div id="container" class="draggable">
                    <button id="up" class="clickable">
                        上传或拖曳文件
                    </button>
                    <p>大小控制在 20 M</p>
                    <p id="upText">...</p>
                </div>
            </div>
        `,
        find(selector) {
            return $(this.el).find(selector)[0]
        },
        render(data = {}) {
            let palceholders = ['name', 'singer', 'url', 'img', 'lrc']
            let html = this.template
            palceholders.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
        },
        findUserData() {
            let needs = 'name singer url img lrc'.split(' ')
            let data = {}
            needs.map((string) => {
                data[string] = $(this.el).find(`[name="${string}"]`).val()
            })
            return data
        },
        active(){
            $(this.el).addClass('active')
        },
        deactive(){
            $(this.el).removeClass('active')
        },
        inputChange(){
            let isChange = 0
            let datas = Object.values(this.findUserData())
            datas.map((data) => {
                if (data !== '') {
                    result = window.confirm('是否重置');
                    if (result) {
                        this.render()
                    }
                }
            })
        },

    }
    let model = {
        data: { id: '', name: '', url: '', singer: '' , img: '', lrc: ''},
        new(data) {
            var Song = AV.Object.extend('Song');
            var song = new Song();
            song.set('name', data.name)
            song.set('singer', data.singer)
            song.set('url', data.url)
            song.set('img', data.img)
            todo.set('lrc', data.lrc);
            return song.save().then((newSong) => {
                let { id, attributes } = newSong
                this.data = { id, ...attributes }
            }, (error) => {
                console.error(error);
            });
        },
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
        },
        bindEvents() {
            window.eventHub.on('upload', (data) => {
                Object.assign(this.model.data, data)
                this.view.render(this.model.data)
            })
            window.eventHub.on('liClick', (data) => {
                this.view.render()
                this.view.active()
            })
            window.eventHub.on('newSongBtnClick', () => {
                this.view.inputChange()
                this.view.deactive()
                this.Qiniuinit()
            })
            $(this.view.el).on('submit', 'form', (e) => {
                e.preventDefault()
                let data = this.view.findUserData()
                this.model.new(data).then(() => {
                    //无刷新更新songList
                    window.eventHub.emit('new', this.model.data)
                })
            })
        },        
        Qiniuinit() {
            let uploader = Qiniu.uploader({
                disable_statistics_report: false,   // 禁止自动发送上传统计信息到七牛，默认允许发送
                runtimes: 'html5',      // 上传模式,依次退化
                browse_button: this.view.find('#up'),         // 上传选择的点选按钮，**必需**
                // 在初始化时，uptoken, uptoken_url, uptoken_func 三个参数中必须有一个被设置
                // 切如果提供了多个，其优先级为 uptoken > uptoken_url > uptoken_func
                // 其中 uptoken 是直接提供上传凭证，uptoken_url 是提供了获取上传凭证的地址，如果需要定制获取 uptoken 的过程则可以设置 uptoken_func
                // uptoken : '<Your upload token>', // uptoken 是上传凭证，由其他程序生成
                uptoken_url: 'http://localhost:8888/uptoken',         // Ajax 请求 uptoken 的 Url，**强烈建议设置**（服务端提供）
                // uptoken_func: function(file){    // 在需要获取 uptoken 时，该方法会被调用
                //    // do something
                //    return uptoken;
                // },
                get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的 uptoken
                // downtoken_url: '/downtoken',
                // Ajax请求downToken的Url，私有空间时使用,JS-SDK 将向该地址POST文件的key和domain,服务端返回的JSON必须包含`url`字段，`url`值为该文件的下载地址
                // unique_names: true,              // 默认 false，key 为文件名。若开启该选项，JS-SDK 会为每个文件自动生成key（文件名）
                // save_key: true,                  // 默认 false。若在服务端生成 uptoken 的上传策略中指定了 `save_key`，则开启，SDK在前端将不对key进行任何处理
                domain: 'http://p86y5hc6k.bkt.clouddn.com/',     // bucket 域名，下载资源时用到，如：'http://xxx.bkt.clouddn.com/' **必需**
                container: this.view.find('#container'),             // 上传区域 DOM ID，默认是 browser_button 的父元素，
                max_file_size: '20mb',             // 最大文件体积限制
                //flash_swf_url: 'path/of/plupload/Moxie.swf',  //引入 flash,相对路径
                max_retries: 3,                     // 上传失败最大重试次数
                dragdrop: true,                     // 开启可拖曳上传
                drop_element: this.view.find('#container'),          // 拖曳上传区域元素的 ID，拖曳文件或文件夹后可触发上传
                chunk_size: '4mb',                  // 分块上传时，每块的体积
                auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传,
                //x_vars : {
                //    自定义变量，参考http://developer.qiniu.com/docs/v6/api/overview/up/response/vars.html
                //    'time' : function(up,file) {
                //        var time = (new Date()).getTime();
                // do something with 'time'
                //        return time;
                //    },
                //    'size' : function(up,file) {
                //        var size = file.size;
                // do something with 'size'
                //        return size;
                //    }
                //},
                init: {
                    'FilesAdded': function (up, files) {
                        plupload.each(files, function (file) {
                            // 文件添加进队列后,处理相关的事情
                        });
                    },
                    'BeforeUpload': function (up, file) {
                        // 每个文件上传前,处理相关的事情
                    },
                    'UploadProgress': function (up, file) {
                        // 每个文件上传时,处理相关的事情
                        upText.textContent = '...ing...'
                        window.eventHub.emit('viewloading')
                    },
                    'FileUploaded': function (up, file, info) {
                        // 每个文件上传成功后,处理相关的事情
                        // 其中 info.response 是文件上传成功后，服务端返回的json，形式如
                        // {
                        //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                        //    "key": "gogopher.jpg"
                        //  }
                        // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

                        var domain = up.getOption('domain');
                        var res = JSON.parse(info.response);
                        var sourceLink = domain + encodeURIComponent(res.key);
                        window.eventHub.emit('upload', {
                            url: sourceLink,
                            name: res.key,
                        })
                    },
                    'Error': function (up, err, errTip) {
                        //上传出错时,处理相关的事情
                    },
                    'UploadComplete': () => {
                        //队列文件处理完毕后,处理相关的事情
                        upText.textContent = 'success'
                        setTimeout(() => {
                            window.eventHub.emit('hiddenloading')
                        }, 3000);
                    },
                    // 'Key': function (up, file) {
                    //     // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                    //     // 该配置必须要在 unique_names: false , save_key: false 时才生效

                    //     var key = "";
                    //     // do something with key here
                    //     return key
                    // }

                }
            });
        }

    }
    controller.init(view, model)
}