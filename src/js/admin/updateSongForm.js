{
    let view = {
        el: '.updateSongFrom',
        template: `
        <h1>编辑歌曲</h1>
        <form action="">
            <div class="row">
                <label for="">歌名:
                    <input name="name" type="text" value="__name__">
                </label>
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
                <button type="submit" class="active">保存</button>
            </div>
        </form>
        `,
        render(data={}) {
            let redata = ['name', 'url', 'singer', 'img']
            let html = this.template
            redata.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
        },
        deactiveBtn(){
            $(this.el).find('button').removeClass('active')
        },
        activeBtn(){
            $(this.el).find('button').addClass('active')
        },
        active(){
            $(this.el).addClass('active')
        },
        deactive() {
            $(this.el).removeClass('active')
        },
        findUserDate(){
            let needs = 'name url singer img'.split(' ')
            let data = {}
            needs.map((string) => {
                data[string] = $(this.el).find(`[name="${string}"]`).val()
            })
            return data
        },
    }
    let model = {
        data: { id: '', name: '', singer: '', url: '' ,img: ''},
        update(data) {
            var todo = AV.Object.createWithoutData('Song', this.data.id);
            // 修改属性
            todo.set('url', data.url);
            todo.set('name', data.name);
            todo.set('singer', data.singer);
            todo.set('img', data.img);
            // 保存到云端
            return todo.save();
        },
    }
    let controller = {
        view: null,
        model: null,
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
        },
        bindEvents() {
            window.eventHub.on('liClick', (data) => {
                this.view.deactive()
                this.model.data = data
                this.view.render(this.model.data)
            })
            window.eventHub.on('newSongBtnClick', () => {
                this.view.active()
                this.view.render()
            })
            $(this.view.el).on('click', 'input', (e) => {
                this.view.deactiveBtn()
            })
            $(this.view.el).on('submit', 'form', (e) => {
                e.preventDefault()
                let data = this.view.findUserDate()
                this.model.update(data).then(() => {
                    //刷新更新songList
                    window.eventHub.emit('update', null)
                    this.view.activeBtn()
                })
            })
        },
    }
    controller.init(view, model)
}