{
    let view = {
        el: '.newSongButton',
        template: `
            <div>
            <svg class="icon add" aria-hidden="true">
            <use xlink:href="#icon-add"></use>
            </svg>
            </div>
        `,
        render() {
            $(this.el).html(this.template)
        },
        active(){
            $(this.el).addClass('active')
        },
        deactive(){
            $(this.el).removeClass('active')
        },
    }
    let model = {
        data: {},
    }
    let controller = {
        view: null,
        model: null,
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            window.eventHub.on('liClick', (e)=>{
                this.view.deactive()
            })
        },
        bindEvents(){
            $(this.view.el).on('click', ()=>{
                this.view.active()
                window.eventHub.emit('newSongBtnClick', null)
            })
        },
    }
    controller.init(view, model)
}