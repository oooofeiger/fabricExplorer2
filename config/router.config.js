export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/password', component: './User/Password' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'non-root','root'],
    routes: [
      //fabricCA
      {path: '/', redirect: '/fabricCA'},
      {
        name: 'fabricCA',
        path: '/fabricCA',
        icon: 'form',
        routes: [
          {path: '/fabricCA', redirect: '/fabricCA/CAManager'},
          {
            path: '/fabricCA/CAManager',
            name: 'CAManager',
            component: './FabricCA/CAManager'
          },
          {
            path: '/fabricCA/CAUser',
            name: 'CAUserManager',
            component: './FabricCA/CAUser'
          },{
            path: '/fabricCA/UserCert',
            name: 'UserCert',
            component: './FabricCA/UserCert'
          }
        ]
      },
      //host
      {
        path: '/host',
        name: 'host',
        icon: 'form',
        routes: [
          {path: '/host', redirect: '/host/manager'},
          {
            path: '/host/manager',
            name: 'host',
            component: './Host/hostManager'
          },{
            path: '/host/docker/list',
            name: 'dockerManager',
            component: './Host/dockerList'
          },
          {
            path: '/host/docker/imageManager',
            name: 'imageManager',
            component: './Host/dockerImage'
          },
          {
            path: '/host/docker/networkManager',
            name: 'networkManager',
            component: './Host/dockerNet'
          },
          {
            path: '/host/docker/volumeManager',
            name: 'volumeManager',
            component: './Host/dockerVolume'
          }
        ]
      },
      
      {
        path: '/network',
        name: 'network',
        icon: 'form',
        routes: [
          { path: '/network', redirect: '/network/peer' },
          {
            path: '/network/peer',
            name: 'peer',
            icon: 'form',
            component: './Network/peer/peer'
          },
          {
            path: '/network/orderer',
            name: 'orderer',
            icon: 'form',
            component: './Network/orderer/orderer'
          },
          
        ]
      },
      //account
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              }
            ],
          },
        ],
      },
      {
        path: '/exception',
        routes: [
          // exception
          {
            path: '/exception/403',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
