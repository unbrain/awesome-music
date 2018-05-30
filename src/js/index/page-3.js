{
    let view = {
        el: '.page-3',
        show() {
            $(this.el).addClass('active')
        },
        hide() {
            $(this.el).removeClass('active')
        },
    }
    let model = {}
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.bindEvents()
        },
        bindEvents() {
            window.eventHub.on('navClick', (e) => {
                if (e === 'page-3') {
                    this.view.show()
                } else {
                    this.view.hide()
                }
            })
        }
    }
    controller.init(view, model)
}