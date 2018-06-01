
{
    let view = {}
    let model = {
        data: {
            id: '',
            singer: '',
            name: '',
            url: ''
        },
        setData(data){
            var query = new AV.Query('Song');
            return query.get(data).then( (song) => {
                Object.assign(this.data, {id: song.id, ...song.attributes})
            }, function (error) {
                // 异常处理
            });
        }
    }
    let controller = {
        init(view, model){
            this.view = view
            this.model = model
            this.model.setData(this.getId()).then(() => {
                console.log(this.model.data)
            })
        },
        getId(){
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

