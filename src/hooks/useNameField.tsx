import { useState, useEffect } from "react";
import { useField } from "formik";
import { useDebouncedCallback } from "use-debounce";
import { TextInputProps } from "@amplication/design-system";

/** @todo share code with server */
const NAME_REGEX = /^(?![0-9])[a-zA-Z0-9$_]+$/;
const NAME_PATTERN = NAME_REGEX.toString().slice(1, -1);
const HELP_TEXT =
"Name must only contain letters, numbers, the dollar sign, or the underscore character and must not start with a number";

const CAPITALIZED_NAME_REGEX = /^[A-Z][a-zA-Z0-9$_]+$/;
const CAPITALIZED_NAME_PATTERN = CAPITALIZED_NAME_REGEX.toString().slice(1, -1);
const CAPITALIZED_HELP_TEXT =
  "Name must only contain letters, numbers, the dollar sign, or the underscore character and must start with a capital letter";

const SHOW_MESSAGE_DURATION = 3000;

export type Props = Omit<TextInputProps, "helpText" | "hasError"> & {
  capitalized?: boolean;
};

const useNameField = ({ capitalized, ...rest }: Props) => {
  const [regexp, pattern, helpText] = capitalized
    ? [CAPITALIZED_NAME_REGEX, CAPITALIZED_NAME_PATTERN, CAPITALIZED_HELP_TEXT]
    : [NAME_REGEX, NAME_PATTERN, HELP_TEXT];
  // @ts-ignore
  const [field, meta] = useField<string>({
    ...rest,
    validate: (value) => (value.match(regexp) ? undefined : helpText),
  });
  const [showMessage, setShowMessage] = useState<boolean>(false);

  const [debouncedHideMessage] = useDebouncedCallback(() => {
    setShowMessage(false);
  }, SHOW_MESSAGE_DURATION);

  useEffect(() => {
    if (meta.error) {
      setShowMessage(true);
    } else {
      debouncedHideMessage();
    }
  }, [meta.error, setShowMessage, debouncedHideMessage]);


  const result = {
    showMessage,
    field,
    pattern,
    helpText
  };

  return result;
};

export default useNameField;
