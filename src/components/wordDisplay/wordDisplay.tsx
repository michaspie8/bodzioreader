function highlightWord(word: string) {
    if (!word) return null;
    const wordWithoutPunctuationAtEnd = word.replace(/[.,!?;:]+$/g, "");
    const middleIndex = Math.floor(wordWithoutPunctuationAtEnd.length / 2);
    const left = word.slice(0, middleIndex);
    const middle = word[middleIndex] ?? "";
    const right = word.slice(middleIndex + 1);
    return (
        <div className="word">
            <span>{left}</span>
            <span className="word-middle">
                <div>^</div>
                {middle}
                <div>^</div>
            </span>
            <span>{right}</span>
        </div>
    );
}

const WordDisplay = ({
    currentWord = "",
    wordsLength = 0,
    currentIndex = 0
}:{
    currentWord: string,
    wordsLength: number,
    currentIndex: number
}) =>{
    return (
        <section className="reader">
            <div className="word-box">{highlightWord(currentWord) || ""}</div>
            <div className="progress">
                <span>
                    {wordsLength + currentIndex + 1 ? `${currentIndex + 1} / ${wordsLength} słów` : "Brak danych"}
                </span>
            </div>
        </section>
    );
}

export default WordDisplay;