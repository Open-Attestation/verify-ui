import { useRouter } from "next/router";

export const useRouterQuery: (key: string) => [string, (value: string) => void, boolean] = (key) => {
  const router = useRouter();
  const { isReady } = router;

  const value = router.query[key] || "";

  const setValue = (value: string) => {
    router.replace({
      query: { ...router.query, [key]: value },
    });
  };

  return [Array.isArray(value) ? value[0] : value, setValue, isReady];
};
