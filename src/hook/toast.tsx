import { useSnackbar, OptionsWithExtraProps, VariantType } from "notistack";

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
    showSuccessToast: (title: string) => {
      enqueueSnackbar(title, {
        ...toastDefaultConfig,
        variant: "success",
      });
    },
    showFailToast: (title: string) => {
      enqueueSnackbar(title, {
        ...toastDefaultConfig,
        variant: "error",
      });
    },
    showInfoToast: (title: string) => {
      enqueueSnackbar(title, {
        ...toastDefaultConfig,
        variant: "info",
      });
    },
  };
}
