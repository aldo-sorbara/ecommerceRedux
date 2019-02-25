import Counter from './components/Counter';

const routes = [
  {
    component: Counter,
    routes: [
      {
        component: Counter,
        path: '/',
        exact: true,
      }
    ],
  },
];

export default routes;