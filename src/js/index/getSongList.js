{
    let view = {
        el: '',
        template: '',
        render(data={}){},
    }
    let model = {
        data = {
            songs: [],
        },
        find(){
            
        }
    }
    let controller = {
        init(view, model){
            this.view = view
            this.model = model
        }
    }
}