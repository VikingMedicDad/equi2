import * as models from "models";

export enum EnumCircleIconStyle {
  Primary = "primary",
  Secondary = "secondary",
  Positive = "positive",
  Negative = "negative",
  Warning = "warning"
}
export enum EnumCircleIconSize {
  Small = "small",
  Default = "default",
  Large = "large"
}

export const STEP_STATUS_TO_STYLE: {
  [key in models.EnumActionStepStatus]: {
    style: EnumCircleIconStyle;
    icon: string;
  };
} = {
  [models.EnumActionStepStatus.Waiting]: {
    style: EnumCircleIconStyle.Warning,
    icon: "refresh_cw",
  },
  [models.EnumActionStepStatus.Running]: {
    style: EnumCircleIconStyle.Warning,
    icon: "refresh_cw",
  },
  [models.EnumActionStepStatus.Failed]: {
    style: EnumCircleIconStyle.Negative,
    icon: "info_i",
  },
  [models.EnumActionStepStatus.Success]: {
    style: EnumCircleIconStyle.Positive,
    icon: "check",
  },
};

export const BUILD_STATUS_TO_STYLE: {
  [key in models.EnumBuildStatus]: {
    style: EnumCircleIconStyle;
    icon: string;
  };
} = {
  [models.EnumBuildStatus.Running]: {
    style: EnumCircleIconStyle.Warning,
    icon: "refresh_cw",
  },
  [models.EnumBuildStatus.Failed]: {
    style: EnumCircleIconStyle.Negative,
    icon: "info_i",
  },
  [models.EnumBuildStatus.Invalid]: {
    style: EnumCircleIconStyle.Negative,
    icon: "info_i",
  },
  [models.EnumBuildStatus.Completed]: {
    style: EnumCircleIconStyle.Positive,
    icon: "check",
  },
};

export const STEP_STATUS_TO_ICON: {
  [key in models.EnumActionStepStatus]: string;
} = {
  [models.EnumActionStepStatus.Success]:  "check",
  [models.EnumActionStepStatus.Failed]:   "close",
  [models.EnumActionStepStatus.Waiting]:  "circle_loader",
  [models.EnumActionStepStatus.Running]:  "",
};

export const STEP_STATUS_TO_ICON_ANT: {
  [key in models.EnumActionStepStatus]: 'wait' | 'process' | 'finish' | 'error';
} = {
  [models.EnumActionStepStatus.Success]:  'finish',
  [models.EnumActionStepStatus.Failed]:   'error',
  [models.EnumActionStepStatus.Waiting]:  'wait',
  [models.EnumActionStepStatus.Running]:  'process',
};