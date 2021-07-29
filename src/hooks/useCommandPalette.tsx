import React, { useState, useMemo } from "react";
import { useQuery, gql } from "@apollo/client";
import { History } from "history";
import { 
	AppstoreOutlined,
	AntDesignOutlined,
	SafetyCertificateOutlined,
	CodeOutlined,
	BranchesOutlined,
	SettingOutlined,
	DatabaseOutlined,
	ApartmentOutlined
} from '@ant-design/icons';
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import { useHistory } from "react-router-dom";
import * as models from "models";
import {getLSCurrentApplication} from '@hooks/useApplicationSelector';

export type AppDescriptor = Pick<models.App, "id" | "name" | "color">;
export type EntityDescriptor = Pick<models.Entity, "id" | "displayName">;
export type AppDescriptorWithEntityDescriptors = AppDescriptor & {
  entities: EntityDescriptor[];
};
export type TData = {
  apps: AppDescriptorWithEntityDescriptors[];
};

export interface Command {
  name: string;
  showAppData: boolean;
  isCurrentApp: boolean;
  type: string;
  appName?: string;
  appColor?: string;
  highlight?: string;
  command(): void;
}

/**
 * Wrapping with a class for testing purposes
 * @see https://github.com/asabaylus/react-command-palette/issues/520
 */
export class NavigationCommand implements Command {
  constructor(
    private readonly history: History,
    public readonly name: string,
    public readonly link: string,
    public readonly type: string,
    public readonly isCurrentApp: boolean,
    public readonly showAppData: boolean,
    public readonly appName?: string,
    public readonly appColor?: string
  ) {}
  command() {
    this.history.push(this.link);
  }
}

const TYPE_APP = "app";
const TYPE_ENTITY = "entity";
const TYPE_ROLES = "roles";

const STATIC_COMMANDS = [
  {
    name: "Dashboard",
    link: "/",
    type: "dashboard"
  },
  {
    name: "Workspaces",
    link: `${APP_PREFIX_PATH}/workspaces`,
    type: "workspaces"
  },
  {
    name: "Command (CLI)",
    link: `${APP_PREFIX_PATH}/console`,
    type: "console"
  },
  {
    name: "Version Control",
    link: `${APP_PREFIX_PATH}/version/`,
    type: "version"
  },
  {
    name: "Settings",
    link: `${APP_PREFIX_PATH}/settings`,
    type: "settings"
  },
  {
    name: "Applications",
    link: `${APP_PREFIX_PATH}/applications/overview`,
    type: "applications"
  }

];

const APPLICATION_COMMANDS = [
  {
    name: "Entities",
    link: `${APP_PREFIX_PATH}/entities/content-model/:id/`,
    type: TYPE_ENTITY,
  },
  {
    name: "Roles",
    link: `${APP_PREFIX_PATH}/settings/permissions/:id/`,
    type: TYPE_ROLES,
  },
];

const useCommandPalette = () => {

  const applicationId = getLSCurrentApplication() || "";

  const history = useHistory();
  const [query, setQuery] = useState("");
  const handleChange = (inputValue: string, userQuery: string) => {
    setQuery(userQuery);
  };
  const { data } = useQuery<TData>(SEARCH, {
    variables: { query },
  });
  const commands = useMemo(
    () => (data ? getCommands(data, history, applicationId) : []),
    [data, history, applicationId]
  );

  const result = {
    commands,
    handleChange,
    calcCommandScore,
    CommandPaletteItem
  };

  return result;
};

const getCategoryIcon = (category:string) => {
	switch (category) {
    case 'app':
      return <AppstoreOutlined className="text-danger"/>;
    case 'entity':
			return <DatabaseOutlined className="text-primary"/>;	
    case 'roles':
      return <SafetyCertificateOutlined className="text-warning"/>;
    case 'dashboard':
      return <AntDesignOutlined className="text-success"/>;
    case 'workspaces':
      return <ApartmentOutlined className="text-danger"/>;
    case 'applications':
      return <AppstoreOutlined className="text-primary"/>;
    case 'entities':
      return <DatabaseOutlined className="text-primary"/>;	
    case 'console':
      return <CodeOutlined className="text-warning"/>;
    case 'version':
      return <BranchesOutlined className="text-warning"/>;
    case 'settings':
      return <SettingOutlined className="text-warning"/>;
		default:
			return null;
	}
}

export default useCommandPalette;

function CommandPaletteItem(suggestion: Command) {
  // A suggestion object will be passed to your custom component for each command
  const {  appName, name, highlight, showAppData, type } = suggestion;
  return (
    <span className="suggestion-result">
      
      <span className="command-palette__app-type">
        <span className="icon">
          {getCategoryIcon(type)} &nbsp;
        </span>
        {highlight && highlight[0] ? (
          <span dangerouslySetInnerHTML={{ __html: highlight[0] }} />
        ) : (
          <span>{name}</span>
        )}
      </span>
      {showAppData && (
          <span className="command-palette__app-name">{appName}</span>
      )}
    </span>
  );
}

export type CommandScoreType = {
  "0": {
    score: number;
  } | null;
  "1": {
    score: number;
  } | null;
  obj: NavigationCommand;
};

export function calcCommandScore(item: CommandScoreType): number {
  const command: NavigationCommand = item.obj;
  const scoreFactor = command.isCurrentApp ? 1000 : 0;

  return Math.max(
    item[0] ? item[0].score + scoreFactor : -1000,
    item[1] ? item[1].score + scoreFactor : -1000
  );
}

export function getStaticCommands(history: History): Command[] {
  return STATIC_COMMANDS.map(
    (command) =>
      new NavigationCommand(
        history,
        command.name,
        command.link,
        command.type,
        false,
        false
      )
  );
}

export function getAppCommands(
  app: AppDescriptor,
  history: History,
  isCurrentApp: boolean
): Command[] {
  const appCommand = new NavigationCommand(
    history,
    app.name,
    `${APP_PREFIX_PATH}/entities/content-model/`,
    TYPE_APP,
    isCurrentApp,
    true,
    app.name,
    app.color
  );
  const appCommands = APPLICATION_COMMANDS.map(
    (command) =>{

      return new NavigationCommand(
        history,
        command.name,
        command.link.replace(":id", app.id),
        command.type,
        isCurrentApp,
        true,
        app.name,
        app.color
      )
    }
  );
  return [appCommand, ...appCommands];
}

export function getEntityCommands(
  entity: EntityDescriptor,
  app: AppDescriptor,
  history: History,
  isCurrentApp: boolean
): Command[] {
  return [
    new NavigationCommand(
      history,
      entity.displayName,
      `${APP_PREFIX_PATH}/applications/${app.id}/content-model/${entity.id}`,
      TYPE_ENTITY,
      isCurrentApp,
      true,
      app.name,
      app.color
    ),
  ];
}

export function getCommands(
  data: TData,
  history: History,
  currentAppId: string | undefined
): Command[] {
  const appCommands = data.apps.flatMap((app) => {
    const isCurrentApp = currentAppId === app.id;
    const appCommands = getAppCommands(app, history, isCurrentApp);
    const entityCommands = app.entities.flatMap((entity) =>
      getEntityCommands(entity, app, history, isCurrentApp)
    );
    return [...appCommands, ...entityCommands];
  });
  const staticCommands = getStaticCommands(history);
  return [...staticCommands, ...appCommands];
}

const SEARCH = gql`
  query search {
    apps {
      id
      name
      color
      entities {
        id
        displayName
      }
    }
  }
`;
