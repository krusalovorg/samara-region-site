import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import './styles/loader.css';
import App from './App';
import Place from './pages/Place';
import Footer from './components/Footer';
import Admin from './pages/Admin';
import ItemsPage from './pages/Items';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import RouterNav from './RouterNav';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// const {
//   createBrowserRouter,
//   RouterProvider,
// } = require("react-router-dom");

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App/>,
//   },
//   {
//     path: "/place/:id",
//     element: <Place/>
//   },
//   {
//     path: "/route/:id",
//     element: <Place route/>
//   },
//   {
//     path: "/admin",
//     element: <Admin/>
//   },
//   {
//     path: "/profile",
//     element: <Profile/>
//   },
//   {
//     path: "/auth",
//     element: <Auth/>
//   },
//   {
//     path: "/all/:category",
//     element: <ItemsPage/>
//   },
//   {
//     path: "*",
//     element: <App/>
//   }
// ]);


root.render(
  <React.StrictMode>
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={'anonymous'} />
      <link href="/output.css" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
    </head>
    {/* <RouterProvider router={router} /> */}
    <RouterNav />
    <Footer />
  </React.StrictMode>
);