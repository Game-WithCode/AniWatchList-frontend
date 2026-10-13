export const yearList = (() => {
    const currentYear = new Date().getFullYear();
    const startYear = 1990; // MAL era safe start

    return Array.from(
        { length: currentYear - startYear + 1 },
        (_, i) => currentYear - i
    );
})();