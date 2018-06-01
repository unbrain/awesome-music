{
    let view = {
        el: '.page-1',
        show(){
            $(this.el).addClass('active')
        },
        hide(){
            $(this.el).removeClass('active')
        },
    }
    let model = {}
    let controller = {
        init(view, model){
            this.view = view
            this.model = model
            this.bindEvents()
            this.loadModule1()
            this.loadModule2()
        },
        bindEvents(){
            window.eventHub.on('navClick', (e) => {
                if (e === 'page-1'){
                    this.view.show()
                }else{
                    this.view.hide()
                }
            })
        },
        loadModule1() {
            let script1 = document.createElement('script')
            script1.src = './js/index/loading.js'
            script1.onload = function () {
                console.log('模块一加载完毕')
            }
            document.body.appendChild(script1)
        },
        loadModule2(){
            let script1 = document.createElement('script')
            script1.src = './js/index/getSongList.js'
            script1.onload = function () {
                console.log('模块二加载完毕')
            }
            document.body.appendChild(script1)
        },
    }
    controller.init(view, model)
}