import * as models from "models";
import * as permissionTypes from "@amp-components/Permissions/types";
import { PresetColorType } from "antd/lib/_util/colors";

export const USER_ENTITY = "User";

export const ENTITY_ACTIONS: permissionTypes.PermissionAction[] = [
  {
    action: models.EnumEntityAction.View,
    actionDisplayName: "View",
    canSetFields: true,
  },
  {
    action: models.EnumEntityAction.Create,
    actionDisplayName: "Create",
    canSetFields: true,
  },
  {
    action: models.EnumEntityAction.Update,
    actionDisplayName: "Update",
    canSetFields: true,
  },
  {
    action: models.EnumEntityAction.Delete,
    actionDisplayName: "Delete",
    canSetFields: false,
  },
  {
    action: models.EnumEntityAction.Search,
    actionDisplayName: "Search",
    canSetFields: true,
  },
];

export const SYSTEM_DATA_TYPES: Set<models.EnumDataType> = new Set([
  models.EnumDataType.Id,
  models.EnumDataType.Username,
  models.EnumDataType.Password,
  models.EnumDataType.Roles,
]);

export const PRESET_COLOR_NUMERIC_VALUE : {
  [key in PresetColorType]:{
    color: string;
  }
} = {
  pink: {
    color:  '#eb2f96'
  },
  red: {
      color: '#de4436'
  },
  yellow: {
      color: '#fadb14'
  },
  orange: {
      color: '#fa8c16'
  },
  cyan: {
      color: '#04d182'
  },
  green: {
      color: '#21b573'
  },
  blue: {
      color: '#3e79f7'
  },
  purple: {
      color: '#a461d8'
  },
  geekblue: {
      color: '#17bcff'
  },
  magenta: {
      color: '#eb2f96'
  },
  volcano: {
      color: '#ff6b72'
  },
  gold: {
    color:  '#ffc542'
  },
  lime: {
    color:  '#a0d911'
  },
};

export const DATA_TYPE_TO_LABEL_AND_ICON: {
  [key in models.EnumDataType]: {
    label: string;
    icon: string;
    color: string;
  };
} = {
  /**@todo: update the icons for each type */
  [models.EnumDataType.SingleLineText]: {
    label: "Single Line Text",
    icon: "type",
    color: PRESET_COLOR_NUMERIC_VALUE["geekblue"].color,
  },
  [models.EnumDataType.MultiLineText]: {
    label: "Multi Line Text",
    icon: "multiline_text",
    color: PRESET_COLOR_NUMERIC_VALUE["geekblue"].color
  },
  [models.EnumDataType.Email]: {
    label: "Email",
    icon: "at_sign",
    color: PRESET_COLOR_NUMERIC_VALUE["geekblue"].color
  },
  [models.EnumDataType.WholeNumber]: {
    label: "Whole Number",
    icon: "bookmark",
    color: PRESET_COLOR_NUMERIC_VALUE["geekblue"].color
  },
  [models.EnumDataType.DecimalNumber]: {
    label: "Decimal Number",
    icon: "decimal_number",
    color: PRESET_COLOR_NUMERIC_VALUE["geekblue"].color
  },
  [models.EnumDataType.DateTime]: {
    label: "Date Time",
    icon: "calendar",
    color: PRESET_COLOR_NUMERIC_VALUE["blue"].color
  },
  [models.EnumDataType.Lookup]: {
    label: "Relation to Entity",
    icon: "lookup",
    color: PRESET_COLOR_NUMERIC_VALUE["purple"].color
  },
  [models.EnumDataType.Boolean]: {
    label: "Boolean",
    icon: "check_square",
    color: PRESET_COLOR_NUMERIC_VALUE["geekblue"].color
  },
  [models.EnumDataType.Json]: {
    label: "Json",
    icon: "code1",
    color: PRESET_COLOR_NUMERIC_VALUE["gold"].color
  },
  [models.EnumDataType.OptionSet]: {
    label: "Option Set",
    icon: "option_set",
    color: PRESET_COLOR_NUMERIC_VALUE["gold"].color
  },
  [models.EnumDataType.MultiSelectOptionSet]: {
    label: "Multi Select Option Set",
    icon: "multi_select_option_set",
    color: PRESET_COLOR_NUMERIC_VALUE["gold"].color
  },
  [models.EnumDataType.GeographicLocation]: {
    label: "Geographic Location",
    icon: "map_pin",
    color: PRESET_COLOR_NUMERIC_VALUE["purple"].color
  },
  [models.EnumDataType.CreatedAt]: {
    label: "Created At",
    icon: "created_at",
    color: PRESET_COLOR_NUMERIC_VALUE["red"].color
  },
  [models.EnumDataType.UpdatedAt]: {
    label: "Updated At",
    icon: "updated_at",
    color: PRESET_COLOR_NUMERIC_VALUE["red"].color
  },

  [models.EnumDataType.Id]: {
    label: "Id",
    icon: "id",
    color: PRESET_COLOR_NUMERIC_VALUE["magenta"].color
  },
  [models.EnumDataType.Username]: {
    label: "Username",
    icon: "user",
    color: PRESET_COLOR_NUMERIC_VALUE["magenta"].color
  },
  [models.EnumDataType.Password]: {
    label: "Password",
    icon: "lock",
    color: PRESET_COLOR_NUMERIC_VALUE["magenta"].color
  },
  [models.EnumDataType.Roles]: {
    label: "Roles",
    icon: "users",
    color: PRESET_COLOR_NUMERIC_VALUE["magenta"].color
  },
};
