{
    let view = {
        el: '.site-loading',
        active() {
            $(this.el).addClass('active')
        },
        deactive() {
            $(this.el).removeClass('active')
        }
    }
    let controller = {
        init(view) {
            this.view = view
            this.bindEventHub()
        },
        bindEventHub() {
            window.eventHub.on('viewloading', () => {
                this.view.active()
            })
            window.eventHub.on('hiddenloading', () => {
                this.view.deactive()
            })
        }
    }
    controller.init(view)
}