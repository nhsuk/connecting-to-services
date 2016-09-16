function render(req, res) {
  res.send(JSON.stringify(req.results));
}

module.exports = render;
