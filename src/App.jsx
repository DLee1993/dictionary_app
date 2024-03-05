import { useState, useMemo } from "react";
import {
    Input,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
    Switch,
} from "@nextui-org/react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Sun, Moon } from "./components/Icons";

function App() {
    const [word, setWord] = useState("");
    const [searchResults, setSearchResults] = useState();
    const [searchError, setSearchError] = useState();
    const [loader, setLoader] = useState(false);
    const [font, setFont] = useState("serif");
    const [isSelected, setIsSelected] = useState(false);

    const selectedValue = useMemo(() => Array.from(font).join("").replaceAll("_", " "), [font]);

    const wordSearch = async (e) => {
        e.preventDefault();
        document.getElementById("startMessage").style.display = "none";

        try {
            setLoader(true);
            setSearchResults();
            setSearchError(false);

            setTimeout(async () => {
                let search = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
                let results = await search.json();

                if (!search.ok) {
                    return setSearchError(results);
                }
                setLoader(false);

                var resultsObject = {
                    word: results[0].word,
                    phonetic: results[0].phonetics.find((o) => o.text).text,
                    meanings: results[0].meanings,
                    audio: results[0].phonetics.find((o) => o.audio)?.audio,
                    source: results[0].sourceUrls[0],
                };

                setSearchResults(resultsObject);
            }, 1000);
        } catch (error) {
            console.log(error);
        }
    };

    const playAudio = () => {
        var audio = document.getElementById("audio");
        audio.play();
    };

    const themeSwitch = () => {
        setIsSelected(!isSelected);
        document.documentElement.classList.toggle("dark");
    };

    return (
        <SkeletonTheme
            baseColor={isSelected ? "#413F3A" : "#ebebeb"}
            highlightColor={isSelected ? "#827E73" : "#f5f5f5"}
        >
            <section className={`py-10 px-5 max-w-[900px] m-auto font-${font.currentKey || font}`}>
                <header className="flex justify-between items-center">
                    <h1 className="text-lg md:text-xl lg:text-2xl font-bold">wordup</h1>
                    <ul className="flex justify-center items-center gap-x-10">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button variant="bordered" className="capitalize">
                                    {selectedValue}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="Select a font"
                                variant="flat"
                                disallowEmptySelection
                                selectionMode="single"
                                selectedKeys={font}
                                onSelectionChange={setFont}
                            >
                                <DropdownItem key="serif">Serif</DropdownItem>
                                <DropdownItem key="sans">Sans Serif</DropdownItem>
                                <DropdownItem key="mono">Monospace</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <li>
                            <Switch
                                isSelected={isSelected}
                                onValueChange={themeSwitch}
                                classNames={{
                                    wrapper: "group-data-[selected=true]:bg-light/30",
                                    thumb: "group-data-[selected=true]:bg-accent",
                                }}
                            >
                                {isSelected ? <Sun /> : <Moon />}
                            </Switch>{" "}
                        </li>
                    </ul>
                </header>
                <main className="mt-16 ">
                    <form onSubmit={wordSearch}>
                        <fieldset className="flex gap-x-2">
                            <Input
                                aria-label="input field"
                                type="text"
                                value={word}
                                onChange={(e) => setWord(e.target.value)}
                                label="Search for a word"
                                placeholder="Search for a word"
                                autoFocus
                                isClearable
                                isRequired
                                onClear={() => setWord("")}
                                classNames={{
                                    inputWrapper: "py-0 min-h-unit-0 h-fit",
                                    innerWrapper: "h-fit flex justify-center items-center",
                                    label: "sr-only",
                                    input: "text-base md:text-lg h-12 font-bold",
                                    clearButton: "m-0 top-1/2 -translate-y-1/2 text-accent",
                                }}
                            />
                            <button className="bg-accent rounded-xl w-14 grid place-items-center hover:bg-accent/65 transition-colors">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-1/2 stroke-light"
                                >
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                    <g
                                        id="SVGRepo_tracerCarrier"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    ></g>
                                    <g id="SVGRepo_iconCarrier">
                                        {" "}
                                        <path
                                            d="M16.6725 16.6412L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        ></path>{" "}
                                    </g>
                                </svg>
                            </button>
                        </fieldset>
                    </form>
                    <div
                        className="font-bold mt-24 max-w-lg mx-auto text-center space-y-8"
                        id="startMessage"
                    >
                        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-accent">
                            Level up your knowledge of the english language.
                        </h1>
                        <p className="text-dark/50 dark:text-light/30 text-sm">
                            To get started, type a word in the search bar and press enter.
                        </p>
                    </div>
                    <section>
                        <section className="mt-10 flex justify-between items-center">
                            <article className="min-w-72">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold capitalize">
                                    {searchResults?.word ||
                                        searchError?.title ||
                                        (loader && <Skeleton />)}
                                </h1>
                                <p className="text-accent mt-2 sm:mt-3 md:mt-4">
                                    {searchResults?.phonetic ||
                                        (loader && !searchError && <Skeleton />)}
                                </p>
                            </article>
                            {searchResults?.audio ? (
                                <aside className="w-20">
                                    <button
                                        className="grid place-items-center bg-accent/20 dark:bg-light/30 rounded-full w-14 md:w-16 h-14 md:h-16 disabled:bg-grey group"
                                        onClick={playAudio}
                                        disabled={!searchResults?.audio}
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-1/2 fill-accent group-disabled:fill-grey"
                                        >
                                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                            <g
                                                id="SVGRepo_tracerCarrier"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            ></g>
                                            <g id="SVGRepo_iconCarrier">
                                                <path d="M21.4086 9.35258C23.5305 10.5065 23.5305 13.4935 21.4086 14.6474L8.59662 21.6145C6.53435 22.736 4 21.2763 4 18.9671L4 5.0329C4 2.72368 6.53435 1.26402 8.59661 2.38548L21.4086 9.35258Z"></path>{" "}
                                            </g>
                                        </svg>
                                    </button>
                                    <audio src={searchResults?.audio} id="audio"></audio>
                                </aside>
                            ) : (
                                loader && !searchError && <Skeleton />
                            )}
                        </section>
                        {searchResults?.source ? (
                            <p className="flex justify-start items-center flex-wrap gap-x-2 py-5 text-dark/45 dark:text-light/20 font-bold">
                                Source:
                                <span className="text-dark dark:text-accent font-normal">
                                    <a
                                        className="hover:underline"
                                        href={searchResults?.source}
                                        target="_blank"
                                    >
                                        {searchResults?.source}
                                    </a>
                                </span>
                            </p>
                        ) : (
                            loader && !searchError && <Skeleton />
                        )}
                        <section>
                            <section>
                                {searchResults?.meanings.map((meaning, index) => (
                                    <article key={index} className="py-10">
                                        <h2 className="flex justify-center items-center gap-x-4 italic font-bold text-xl font-serif">
                                            {meaning.partOfSpeech}{" "}
                                            <div className="bg-grey/10 w-full h-[2px]"></div>
                                        </h2>
                                        <p className="text-dark/45 dark:text-light/20 mt-5 font-bold">
                                            Meaning
                                        </p>
                                        <ul className="ml-10 mt-10 space-y-2 list-disc">
                                            {meaning.definitions.map((def, index) => (
                                                <li className="marker:text-accent" key={index}>
                                                    <div className="flex flex-col gap-y-2">
                                                        {def.definition}
                                                        {def.example && (
                                                            <span className="text-dark/45 dark:text-light/20">{`"${def.example}"`}</span>
                                                        )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                        {meaning.antonyms?.length > 0 && (
                                            <aside className="font-bold text-dark/45 dark:text-light/20 mt-10">
                                                Antonyms:{" "}
                                                <span className="text-accent">
                                                    {meaning.antonyms}
                                                </span>
                                            </aside>
                                        )}
                                        {meaning.synonyms?.length > 0 && (
                                            <aside className="font-bold text-dark/45 dark:text-light/20 mt-10">
                                                Synonyms:{" "}
                                                <span className="text-accent">
                                                    {meaning.synonyms}
                                                </span>
                                            </aside>
                                        )}
                                    </article>
                                ))}
                            </section>
                        </section>
                    </section>
                </main>
            </section>
        </SkeletonTheme>
    );
}

export default App;
