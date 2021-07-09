import {useMediaQuery} from "@material-ui/core";

export const useIsOnMobile = () => useMediaQuery('(max-width: 600px)')
