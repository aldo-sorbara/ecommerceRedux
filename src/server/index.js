import { Provider } from 'react-redux';
import React from 'react';
import { StaticRouter } from 'react-router';
import { renderRoutes } from 'react-router-config';
import configureStore from '../common/store/configureStore';
import express from 'express';
import { renderToString } from 'react-dom/server';
import serialize from 'serialize-javascript';
import routes from '../common/routes';
import api from '../common/api';
import { ServerStyleSheet } from 'styled-components';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .use('/api', api)
  .get('/*', (req, res) => {
    // Compile an initial state
    const preloadedState = { counter: 10 };

    // Create a new Redux store instance
    const store = configureStore(preloadedState);

    // Create the server side style sheet
    const sheet = new ServerStyleSheet();

    // Render the component to a string
    // When the app is rendered collect the styles that are used inside it
    const markup = renderToString(
      sheet.collectStyles(
        <Provider store={store}>
          <StaticRouter location={req.url} context={{}}>
            {renderRoutes(routes, preloadedState)}
          </StaticRouter>
        </Provider>
      )
    );

    // Generate all the style tags so they can be rendered into the page
    const styleTags = sheet.getStyleTags();

    // Grab the initial state from our Redux store
    const finalState = store.getState();

    res.send(`<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet='utf-8' />
        <title>Razzle Redux Example</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${
          assets.client.css
            ? `<link rel="stylesheet" href="${assets.client.css}">`
            : ''
        }
          ${
            process.env.NODE_ENV === 'production'
              ? `<script src="${assets.client.js}" defer></script>`
              : `<script src="${assets.client.js}" defer crossorigin></script>`
          }
          <!-- Render the style tags gathered from the components into the DOM -->
          ${styleTags}
          
    </head>
    <body>
        <div id="root">${markup}</div>
        <script>
          window.__PRELOADED_STATE__ = ${serialize(finalState)}
        </script>
    </body>
</html>`);
  });

export default server;
