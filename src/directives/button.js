function handleButton(e) {
  const target = $(e.currentTarget)
  if (e.type === 'mousedown') {
    target.addClass('selected')
  } else {
    target.removeClass('selected')
  }
}

export default {
  bind: function (el, binding, vnode) {
    $(el)
      .mousedown(handleButton)
    $(el)
      .mouseup(handleButton)
    $(el)
      .mouseout(handleButton)
  }
}
