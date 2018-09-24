import { Map } from 'immutable';

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState) {
            var temp = JSON.parse(serializedState);
            var data = {};
            Object.keys(temp).forEach(function (k, value) {
                data[k] = new Map(temp[k])
            });
            return data;
        } else {
            return undefined;
        }
    }
    catch (err) {
        return err;
    }
}

export const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    }
    catch (err) {

    }
}
