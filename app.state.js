import {observable} from 'mobx';

class AppState {
    @observable todo = 'Mobx';

    setTodo = (txt) => {
        console.log(this.todo);
        this.todo = txt;
    };

}

export default new AppState();