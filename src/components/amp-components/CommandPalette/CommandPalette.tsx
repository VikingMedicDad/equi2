import React from "react";
// @ts-ignore
import ReactCommandPalette from "react-command-palette";
// @ts-ignore
import * as models from "models";
import useCommandPalette from "@hooks/useCommandPalette";
import "./CommandPalette.scss";
// import "./chromeTheme.css";

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

const HOT_KEYS = ["command+shift+p", "ctrl+shift+p"];

const THEME = {
  // modal: "command-palette__modal",
  modal: "command-palette__modal",
  overlay: "command-palette__overlay",
  container: "command-palette__container",
  header: "command-palette__header",
  content: "command-palette__content",
  containerOpen: "command-palette__container--open",
  input: "command-palette__input",
  inputOpen: "command-palette__input--open",
  inputFocused: "command-palette__input--focused",
  spinner: "command-palette__spinner",
  suggestionsContainer: "command-palette__suggestions-container",
  suggestionsContainerOpen: "command-palette__suggestions-container--Open",
  suggestionsList: "command-palette__suggestions-list",
  suggestion: "command-palette__suggestion",
  suggestionFirst: "command-palette__suggestion--first",
  suggestionHighlighted: "command-palette__suggestion--highlighted",
  trigger: "command-palette__trigger",
};


type Props = {
  trigger: React.ReactNode;
};

const CommandPalette = ({ trigger }: Props) => {
  
  const {
    commands,
    handleChange,
    calcCommandScore,
    CommandPaletteItem
  } = useCommandPalette();

  return (
    <ReactCommandPalette
      trigger={trigger}
      commands={commands}
      onChange={handleChange}
      closeOnSelect
      showSpinnerOnSelect={false}
      theme={THEME}
      hotKeys={HOT_KEYS}
      options={{
        key: "name",
        keys: ["name", "appName"],
        allowTypo: true,
        scoreFn: calcCommandScore,
      }}
      renderCommand={CommandPaletteItem}
    />
  );
};

export default CommandPalette;