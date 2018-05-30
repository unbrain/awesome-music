{
    let view = {
        el: '#tabs',
    }
    let model = {}
    let controller = {
        init(view, model){
            this.view = view 
            this.model = model
            this.bindEvent()
        },
        bindEvent(){
            $(this.view.el).on('click', '.tabs-nav > li', (e) => {
                let $li = $(e.currentTarget)
                $li.addClass('active').siblings().removeClass('active')
            })
        }
    }
    controller.init(view, model)
}