{
    let view = {
        el: '.songList',
        template: `
        <h2>歌曲列表</h2>
            <ul></ul>
        `,
        render(data={}) {
            $el = $(this.el)
            $el.html(this.template)
            let { songs, selectedId } = data
            let liList = songs.map((song) => {
                let $li = $('<li></li>').text(song.name).attr('song-id', song.id)
                if (selectedId === song.id) {
                    $li.addClass('active')
                }
                return $li
            })
            $el.find('ul').empty()
            liList.map((li) => {
                $el.find('ul').append(li)
            })
        },
    }
    let model = {
        data: {
            songs: [],
            selectedId: null,
        },
        find() {
            var query = new AV.Query('Song');
            return query.find().then((songs) => {
                this.data.songs = songs.map((song) => {
                    return { id: song.id, ...song.attributes }
                })
                return songs
            })
        },

    }
    let controller = {
        view: null,
        model: null,
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.findAllSongs()
            this.bindEvents()
        },
        findAllSongs() {
            this.model.find().then(() => {
                this.view.render(this.model.data)
            })
        },
        bindEvents() {
            window.eventHub.on('newSongBtnClick', () => {
                this.model.data.selectedId = null
                this.view.render(this.model.data)
            })
            window.eventHub.on('update', () => {
                this.findAllSongs()
            })
            window.eventHub.on('new', (data) => {
                this.model.data.songs.push(data)
                this.view.render(this.model.data)
            })
            $(this.view.el).on('click', 'li', (e) => {
                this.model.data.selectedId = e.currentTarget.getAttribute('song-id')
                this.view.render(this.model.data)
                let sedata = {}
                this.model.data.songs.map((song) => {
                    if (song.id === this.model.data.selectedId) {
                        sedata = song
                    }
                })
                window.eventHub.emit('liClick', sedata)
            })
        },
    }
    controller.init(view, model)
}