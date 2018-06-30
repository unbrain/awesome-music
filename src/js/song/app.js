{
    let view = {
        el: '#app',
        render(data) {
            $(this.el).find('.apppage').css('background-image', "url(" + data.img + ")")
            // console.log(0)
            $(this.el).find('audio').attr('src', data.url)
            if ($(this.el).find('audio').attr('src') === data.url) {
                let audio = $(this.el).find('audio').attr('src', data.url).get(0)
                audio.ontimeupdate = () => {
                    this.showLyric(audio.currentTime)
                }
            }
            $(this.el).find('.page').css('background-image', "url(" + data.img + ")")
            $(this.el).find('.name').text(data.name)
            $(this.el).find('.singer').text(data.singer)
            data.lrc.split('\n').map((string) => {
                let p = document.createElement('p')
                let regex = /\[([\d:.]+)\](.+)/
                let matches = string.match(regex)
                if (matches) {
                    p.textContent = matches[2]
                    let time = matches[1]
                    let parts = time.split(':')
                    let minutes = parts[0]
                    let seconds = parts[1]
                    let newTime = parseInt(minutes, 10) * 60 + parseFloat(seconds, 10)
                    p.setAttribute('data-time', newTime)
                } else {
                    p.textContent = string
                }
                $(this.el).find('.lrc').append(p)
            })
        },
        showLyric(time) {
            let allP = $(this.el).find('.lrc>p')
            let p
            for (let i = 0; i < allP.length; i++) {
                if (i === allP.length - 1) {
                    p = allP[i]
                    break
                } else {
                    let currentTime = allP.eq(i).attr('data-time')
                    let nextTime = allP.eq(i + 1).attr('data-time')
                    if (currentTime <= time && time < nextTime) {
                        p = allP[i]
                        break
                    }
                }
            }
            let pHeight = p.getBoundingClientRect().top
            let linesHeight = $(this.el).find('.lrc')[0].getBoundingClientRect().top
            let height = pHeight - linesHeight
            $(this.el).find('.lrc').css({
                transform: `translateY(${- (height - 25)}px)`
            })
            $(p).addClass('active').siblings('.active').removeClass('active')
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
            lrc: '',
            status: true,
        },
        setData(data) {
            var query = new AV.Query('Song');
            return query.get(data).then((song) => {
                Object.assign(this.data, {
                    id: song.id,
                    ...song.attributes
                })
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
            $(audio).on('ended', () => {
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