import { Theme } from "@material-ui/core";

export function createTopRoundBorder(theme: Theme) {
    return {
        borderTop: `${theme.palette.divider} 4px solid`,
        borderTopLeftRadius: "4px",
        borderTopRightRadius: "4px"
    }
}