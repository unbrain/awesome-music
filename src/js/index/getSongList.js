{
    let view = {
        el: 'section.songs',
        template: `
        <a class="songlink" href="/m/song?id={{song.id}}">
              <div class="songDetail">
                <div class="songName">
                  <h3>{{song.name}}</h3>
                  <p>{{song.singer}}</p>
                </div>
                <div class="play">
                  <span class="playbtn"></span>
                </div>
              </div>
            </a>`,
        render(data = {}) {
            let { songs } = data
            songs.map((song) => {
                let $li = $(this.template
                    .replace('{{song.name}}', song.name)
                    .replace('{{song.singer}}', song.singer)
                    .replace('{{song.id}}', song.id)) 

                $(this.el).find('ol.list').append($li)
            })
        },
        deactive() {
            console.log(0)
            $(this.el).find('.line-scale').addClass('active')
        },
    }
    let model = {
        data: {
            songs: [],
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
        init(view, model) {
            this.view = view
            this.model = model
            this.model.find().then(()=>{
                this.view.deactive()
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view, model)
}