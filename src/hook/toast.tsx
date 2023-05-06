import {
  useSnackbar,
  OptionsWithExtraProps,
  VariantType,
  SnackbarAction,
} from "notistack";

type ToastConfig = {
  title: string;
  action?: SnackbarAction;
};

export function useAppToast() {
  const { enqueueSnackbar } = useSnackbar();
  const toastDefaultConfig: OptionsWithExtraProps<VariantType> = {
    anchorOrigin: {
      horizontal: "right",
      vertical: "top",
    },
    autoHideDuration: 3000,
  };
  return {
    showSuccessToast: (config: ToastConfig) => {
      const { title, action } = config;
      enqueueSnackbar(title, {
        ...toastDefaultConfig,
        variant: "success",
        action,
      });
    },
    showFailToast: (config: ToastConfig) => {
      const { title, action } = config;
      enqueueSnackbar(title, {
        ...toastDefaultConfig,
        variant: "error",
        action,
      });
    },
    showInfoToast: (config: ToastConfig) => {
      const { title, action } = config;
      enqueueSnackbar(title, {
        ...toastDefaultConfig,
        variant: "info",
        action,
      });
    },
  };
}
