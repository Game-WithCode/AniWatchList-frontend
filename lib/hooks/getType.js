export const getCategory = (type) => {
    const animeTypes = ["TV", "Movie", "OVA", "ONA", "Special", "Music"];
    const mangaTypes = ["Manga", "Novel", "Light Novel", "One-shot", "Doujinshi", "Manhwa", "Manhua"];

    if (animeTypes.includes(type)) return "anime";
    if (mangaTypes.includes(type)) return "manga";

    return "unknown";
};