import { Router } from 'express';

const router = new Router();

router.get('/search/:query', (req, res, next) => {
  req.twitter
    .search(req.params.query)
    .then(json => res.json(json))
    .catch(err => {
      const error = new Error(err);
      error.jsonResponse = err;
      next(error);
    });
});

router.use((req, res) => {
  res.status(404).json({ errors: [{ message: 'Not found', code: 404 }] });
});

router.use((err, req, res, next) => {
  res
    .status(500)
    .json(err.jsonResponse || { errors: [{ message: err.toString() }] });
});

export default router;
