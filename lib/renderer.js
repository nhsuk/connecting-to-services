function render(req, res) {
  res.send(req.message);
}

module.exports = render;
