import { 
  AntDesignOutlined, 
  QuestionOutlined,
  CodeOutlined,
  BranchesOutlined,
  LogoutOutlined,
  SettingOutlined,
  DatabaseOutlined,
  SafetyCertificateOutlined,
  AppstoreOutlined,
  ApartmentOutlined,
  GithubOutlined,
  RadarChartOutlined,
  SubnodeOutlined,
  BuildOutlined,
  EyeOutlined,
  ApiOutlined,
  CodeSandboxOutlined,
  RocketOutlined,
  BlockOutlined,
  HeatMapOutlined,
  UnlockOutlined,
  IdcardOutlined,
  ReadOutlined,
  ProfileOutlined,
  BookOutlined,
  BulbOutlined,
  UserOutlined
} from '@ant-design/icons';

import { APP_PREFIX_PATH } from 'configs/AppConfig';

//Dashboard
const dashBoardNavTree = [{
  key: 'home-dashboard',
  path: `${APP_PREFIX_PATH}/home`,
  title: 'sidenav.dashboard',
  icon: AntDesignOutlined,
  breadcrumb: true,
  submenu: []
}];


//Applications
const appNavTree = [{
  key: 'applications',
  path: `${APP_PREFIX_PATH}/applications`,
  title: 'sidenav.apps',
  icon: AppstoreOutlined,
  breadcrumb: true,
  submenu: [
    {
      key: 'applications-overview',
      path: `${APP_PREFIX_PATH}/applications/overview`,
      title: 'sidenav.apps.overview',
      icon: EyeOutlined,
      breadcrumb: true,
      submenu: []
    },
    {
      key: 'applications-integrations',
      path: `${APP_PREFIX_PATH}/applications/integrations`,
      title: 'sidenav.apps.integrations',
      icon: ApiOutlined,
      breadcrumb: true,
      submenu: []
    },
    {
      key: 'applications-open-in-sandbox',
      path: `${APP_PREFIX_PATH}/applications/sandbox`,
      title: 'sidenav.apps.sandbox',
      icon: CodeSandboxOutlined,
      breadcrumb: true,
      submenu: []
    },
    {
      key: 'applications-app-deploy',
      path: `${APP_PREFIX_PATH}/applications/deploy`,
      title: 'sidenav.apps.deploy',
      icon: RocketOutlined,
      breadcrumb: true,
      submenu: []
    }
  ]
}];

//Entities
const entitiesBoardNavTree = [{
  key: 'entities',
  path: `${APP_PREFIX_PATH}/entities`,
  title: 'sidenav.entities',
  icon: DatabaseOutlined,
  breadcrumb: true,
  submenu: [
    {
      key: 'entities-content-model',
      path: `${APP_PREFIX_PATH}/entities/content-model/entities`,
      title: 'sidenav.entities.content-model',
      icon: BlockOutlined,
      breadcrumb: true,
      submenu: []
    },
    {
      key: 'entities-schemas-analysis',
      path: `${APP_PREFIX_PATH}/entities/schemas-analysis`,
      title: 'sidenav.entities.schemas-analysis',
      icon: HeatMapOutlined,
      breadcrumb: true,
      submenu: []
    }
  ]
}];

//Workspaces
const workspacesNavTree = [{
  key: 'workspaces',
  path: `${APP_PREFIX_PATH}/workspaces`,
  title: 'sidenav.workspaces',
  icon: ApartmentOutlined,
  breadcrumb: true,
  submenu: [
    ...appNavTree,
    ...entitiesBoardNavTree,
    {
      key: 'workspace-settings',
      path: `${APP_PREFIX_PATH}/workspaces`,
      title: 'sidenav.workspaces.settings',
      icon: SettingOutlined,
      breadcrumb: true,
      submenu: []
    }
  ]
}];



//Command Line Interface
const cliNavTree = [{
  key: 'console',
  path: `${APP_PREFIX_PATH}/console`,
  title: 'sidenav.console',
  icon: '',
  breadcrumb: true,
  submenu: [
    {
      key: 'console-cli-command-line-interface',
      path: `${APP_PREFIX_PATH}/console/cli`,
      title: 'sidenav.console.cli',
      icon: CodeOutlined,
      breadcrumb: true,
      submenu: []
    },
    {
      key: 'console-graphql-gql-GraphQL',
      path: `${APP_PREFIX_PATH}/console/gql`,
      title: 'sidenav.console.gql',
      icon: RadarChartOutlined,
      breadcrumb: true,
      submenu: []
    }
  ]
}];

//Version Control
const versionControlNavTree = [{
  key: 'version-control',
  path: `${APP_PREFIX_PATH}/version`,
  title: 'sidenav.version',
  icon: '',
  breadcrumb: true,
  submenu: [
    {
      key: 'version-control-pending-staging',
      path: `${APP_PREFIX_PATH}/version/staging`,
      title: 'sidenav.version.staging',
      icon: BranchesOutlined,
      breadcrumb: true,
      badge:true,
      submenu: []
    },
    {
      key: 'version-control-commits',
      path: `${APP_PREFIX_PATH}/version/commits/version`,
      title: 'sidenav.version.commit',
      icon: SubnodeOutlined,
      breadcrumb: true,
      submenu: []
    },
    {
      key: 'version-control-sync-github',
      path: `${APP_PREFIX_PATH}/version/sync`,
      title: 'sidenav.version.sync',
      icon: GithubOutlined,
      breadcrumb: true,
      submenu: []
    },
    {
      key: 'version-control-build-status-pipeline',
      path: `${APP_PREFIX_PATH}/version/build-status/version`,
      title: 'sidenav.version.build',
      icon: BuildOutlined,
      breadcrumb: true,
      submenu: []
    }
  ]
}];

//Roles
const roleNavTree = [{
  key: 'settings-role',
  path: `${APP_PREFIX_PATH}/settings/`,
  title: 'sidenav.role',
  icon: SafetyCertificateOutlined,
  breadcrumb: true,
  submenu: [
    {
      key: 'settings-role-permissions',
      path: `${APP_PREFIX_PATH}/settings/permissions`,
      title: 'sidenav.role.permission',
      icon: UnlockOutlined,
      breadcrumb: true,
      submenu: []
    },
    {
      key: 'settings-role-api-tokens',
      path: `${APP_PREFIX_PATH}/settings/api-tokens`,
      title: 'sidenav.role.token',
      icon: IdcardOutlined,
      breadcrumb: true,
      submenu: []
    }
  ]
}];

const userNavTree = [{
  key: 'settings-user-edit-profile',
  path: `${APP_PREFIX_PATH}/settings/edit-profile`,
  title: 'sidenav.settings.user',
  icon: UserOutlined,
  breadcrumb: true,
  submenu: []
}];

//Settings
const settingsNavTree = [{
  key: 'settings',
  path: `${APP_PREFIX_PATH}/settings`,
  title: 'sidenav.settings',
  icon: SettingOutlined,
  breadcrumb: true,
  submenu: [
    ...roleNavTree,
    ...userNavTree
  ]
}];

//Support
const supportNavTree = [{
  key: 'support',
  path: `${APP_PREFIX_PATH}/support`,
  title: 'sidenav.docs.support',
  icon: QuestionOutlined,
  breadcrumb: true,
  submenu: [
    {
      key: 'support-start',
      path: `${APP_PREFIX_PATH}/home`,
      title: 'sidenav.docs.tutorial',
      icon: BulbOutlined,
      breadcrumb: true,
      submenu: []
    },
    {
      key: 'support-dev',
      path: `${APP_PREFIX_PATH}/home`,
      title: 'sidenav.docs.dev',
      icon: ReadOutlined,
      breadcrumb: true,
      submenu: []
    },
    {
      key: 'support-changelog',
      path: `${APP_PREFIX_PATH}/home`,
      title: 'sidenav.docs.changelog',
      icon: ProfileOutlined,
      breadcrumb: true,
      submenu: []
    },
    {
      key: 'support-cms',
      path: `${APP_PREFIX_PATH}/home`,
      title: 'sidenav.docs.cms',
      icon: BookOutlined,
      breadcrumb: true,
      submenu: []
    }
  ]
}];

//Docs
const docsNavTree = [{
  key: 'docs',
  path: `${APP_PREFIX_PATH}/home`,
  title: 'sidenav.docs',
  icon: '',
  breadcrumb: true,
  submenu: [
    ...supportNavTree
  ]
}];

//Logout
const logoutNavTree = [{
  key: 'logout',
  path: `${APP_PREFIX_PATH}/logout`,
  title: 'sidenav.logout',
  icon: LogoutOutlined,
  breadcrumb: true,
  submenu: [],
  isLogout:true,
}];

const othersNavTree = [{
  key: 'others',
  path: `${APP_PREFIX_PATH}/home`,
  title: 'sidenav.empty',
  icon: '',
  breadcrumb: true,
  submenu: [
    ...logoutNavTree
  ]
}];

const navigationConfig = [
  ...dashBoardNavTree,
  ...workspacesNavTree,
  ...cliNavTree,
  ...versionControlNavTree,
  ...settingsNavTree,
  ...docsNavTree,
  ...othersNavTree
]

export default navigationConfig;
