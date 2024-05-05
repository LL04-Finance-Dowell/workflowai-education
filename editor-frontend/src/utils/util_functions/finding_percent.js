export const finding_percent = (element, arg, width) => {
  if (window.innerWidth < 993) {
    if (arg == 'width') {
      return (element.width / 793.69) * 100 + '%';
    } else {
      return (element.left / 793.69) * width + 'px';
    }
  } else {
    if (arg == 'width') {
      return element.width + 'px';
    } else {
      return element.left + 'px';
    }
  }
};
