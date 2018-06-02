{
    let view = {
        el: '#app',
        render(data) {
            // console.log(data)
            $(this.el).find('.apppage').css('background-image', "url(" + data.img + ")")
            // console.log(0)
            $(this.el).find('audio').attr('src', data.url)
            $(this.el).find('.page').css('background-image', "url(" + data.img + ")")
            $(this.el).find('.name').text(data.name)
            $(this.el).find('.singer').text(data.singer)
        },
        play() {
            let audio = $(this.el).find('audio')[0]
            audio.play()
        },
        pause() {
            let audio = $(this.el).find('audio')[0]
            audio.pause()
        },
        active() {
            $(this.el).find('.songPlay').addClass('active')
            $(this.el).find('.page').addClass('active')
            $(this.el).find('.discLightCover > div').addClass('active')
        },
        deactive() {
            $(this.el).find('.songPlay').removeClass('active')
            $(this.el).find('.page').removeClass('active')
            $(this.el).find('.discLightCover > div').removeClass('active')
        },
    }
    let model = {
        data: {
            id: '',
            singer: '',
            name: '',
            url: '',
            img: '',
            status: true,
        },
        setData(data) {
            var query = new AV.Query('Song');
            return query.get(data).then((song) => {
                Object.assign(this.data, { id: song.id, ...song.attributes })
            }, function (error) {
                // 异常处理
            });
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.model.setData(this.getId()).then(() => {
                this.view.render(this.model.data)
                this.view.play()
            })
            this.bindEvents()
        },
        bindEvents() {
            $(this.view.el).on('click', '.songdisc', () => {
                if (this.model.data.status) {
                    this.view.pause()
                    this.view.active()
                    this.model.data.status = false
                } else {
                    this.view.play()
                    this.model.data.status = true
                    this.view.deactive()
                }

            })
            let audio = $(this.view.el).find('audio')[0]
            $(audio).on('ended', ()=>{
                this.view.pause()
                this.view.active()
                this.model.data.status = false
            })
        },
        getId() {
            let search = window.location.search
            if (search.indexOf('?') === 0) {
                search = search.substring(1)
            }
            let arr = search.split('&').filter(v => v)
            let id = ''
            for (let i = 0; i < arr.length; i++) {
                let kv = arr[i].split('=')
                let key = kv[0]
                let value = kv[1]
                if (key === 'id') {
                    id = value
                }
            }
            return id
        },
    }
    controller.init(view, model)
}

