import CONSTANTS from 'constants/InterceptorConstants';

const initialState = {
    count: 0,
    enabled: true
};

export default (state = initialState, action) => {
    const newState = JSON.parse(JSON.stringify(state));

    switch (action.type) {
        case CONSTANTS.ADD:
            newState.count += 1;
            return newState;
        case CONSTANTS.REMOVE:
            newState.count -= 1;
            return newState;
        case CONSTANTS.TOGGLE:
            newState.enabled = action.payload.enabled;
            return newState;
        default:
            return newState;
    }
};
