export function createTopRoundBorder(color: string) {
    return {
        borderTop: `${color} 4px solid`,
        borderTopLeftRadius: "4px",
        borderTopRightRadius: "4px"
    }
}

export function createFakeToolbarClass(theme: any) {
    return {
        fakeToolbar: {
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
        }
    }
}