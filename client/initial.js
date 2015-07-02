import { Rx } from 'cyclejs';

export default function ModelSource() {
    return {
        model$: Rx.Observable.just({ fuck: 'you'} )
    };
};
