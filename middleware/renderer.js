function render(req, res) {
  res.send(JSON.stringify(req.results.slice(0, 3)));
}

module.exports = render;
