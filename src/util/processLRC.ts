export const lrcTimestampRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g;
export const lrcTimestampRegexLocal = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

// Convert LRC lyrics to timestamps and processed lines
export const processLrcLyrics = (lyrics: string, g = true) => {
    const lines = lyrics.split("\n");
    const timestamps: number[] = [];
    const processedLines: string[] = [];
  
    lines.forEach(line => {
      const match = lrcTimestampRegex.exec(line);
      if (match) {
        timestamps.push((parseInt(match[1]) * 60 * 1000 + parseInt(match[2]) * 1000 + parseInt(match[3])*10) / 1000);
        processedLines.push(line.replace(g ? lrcTimestampRegex : lrcTimestampRegexLocal, "").trim());
      }
    });
  
    return { timestamps, processedLines };
  }

  // Convert single LRC line with timestamps into timestamps and words/phrases
export const processLrcLine = (line: string) => {
    // get timestamps and words/phrases
    // for example: "[00:00.00]This is a [00:01.00]lyric [00:02.00]line." => [0, 1000, 2000], ["This is a ", "lyric ", "line."]
    const timestamps: number[] = [];
    const words: string[] = [];

    let match;
    while ((match = lrcTimestampRegex.exec(line)) !== null) {
      timestamps.push((parseInt(match[1]) * 60 * 1000 + parseInt(match[2]) * 1000 + parseInt(match[3])) / 1000);
    }

    console.log( line);
    // use new regex to split line by timestamps
    const splitWords = line.replace(lrcTimestampRegex, "|:|").split("|:|");

    splitWords.forEach((word) => {
      if (word.trim() !== "") {
        words.push(word);
      }
    });

    console.log({ words, timestamps });

    return { words, timestamps };
  }