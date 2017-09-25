import{
  CHANGE_IS_MOBILE,
  CHANGE_WIDTH_AND_HEIGHT,
  TOGGLE_SEARCH_MODAL,
} from './ActionTypes';

function changeIsMobile(isMobile) {
  return {
    type: CHANGE_IS_MOBILE,
    isMobile
  };
}

function changeWidthAndHeight(screenHeight, screenWidth) {
  return {
    type: CHANGE_WIDTH_AND_HEIGHT,
    screenHeight,
    screenWidth
  };
}
export function toggleSearchModal(isOpen, category='') {
  return (dispatch) => {
    dispatch({
      type: TOGGLE_SEARCH_MODAL,
      isOpen,
      category
    });
  };
}

export function initEnvironment() {
  return dispatch => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    dispatch(changeIsMobile(isMobile));
    dispatch(changeWidthAndHeight(window.innerHeight, window.innerWidth));

    window.onresize = () => {
      dispatch(changeWidthAndHeight(window.innerHeight, window.innerWidth));
    };
  };
}
