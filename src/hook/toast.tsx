import { useToast, UseToastOptions } from "@chakra-ui/react";

export function useAppToast() {
  const toast = useToast();
  const toastDefaultConfig: UseToastOptions = {
    isClosable: true,
    position: "top-right",
    duration: 3000,
  };
  return {
    showSuccessToast: (title: string) => {
      toast({
        ...toastDefaultConfig,
        title: title,
        status: "success",
      });
    },
    showFailToast: (title: string) => {
      toast({
        ...toastDefaultConfig,
        title: title,
        status: "error",
      });
    },
    showInfoToast: (title: string) => {
      toast({
        ...toastDefaultConfig,
        title: title,
        status: "info",
      });
    },
  };
}
