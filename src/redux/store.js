import { createStore } from 'redux';
import reducer from './reducer';

const configureStore = () => {
    return createStore(reducer);
}

export default configureStore;
