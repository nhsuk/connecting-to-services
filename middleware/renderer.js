function render(req, res) {
  res.send(JSON.stringify(req.openResults));
}

module.exports = render;
