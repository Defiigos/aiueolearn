/**
 * Собирает список классов из строк/условных записей, отбрасывая пустые.
 * Принимает строки и объекты вида `{ 'is-active': cond, 'callout': true }`.
 */
export function cx(
    ...entries: ReadonlyArray<string | false | null | undefined | Record<string, boolean | undefined>>
): string {
    const classes: string[] = [];

    for (const entry of entries) {
        if (!entry) {
            continue;
        }
        if (typeof entry === 'string') {
            classes.push(entry);
            continue;
        }
        for (const [className, enabled] of Object.entries(entry)) {
            if (enabled) {
                classes.push(className);
            }
        }
    }

    return classes.join(' ');
}